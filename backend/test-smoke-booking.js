const prisma = require('./dist/config/database.js').default;
const { toolRegistry } = require('./dist/ai/tool-registry.js');

(async () => {
  const existingBusiness = await prisma.business.findFirst({
    where: { name: 'Sunrise Dental Clinic' }
  });

  const business = existingBusiness || await prisma.business.create({
    data: {
      name: 'Sunrise Dental Clinic',
      industry: 'Dental',
      phone: '+1234567890',
      email: 'info@sunrisedental.com',
      address: '123 Main St',
      description: 'Test clinic'
    }
  });

  const existingStaff = await prisma.staff.findFirst({
    where: { name: 'Dr. Mehmood', businessId: business.id }
  });

  const staff = existingStaff || await prisma.staff.create({
    data: {
      businessId: business.id,
      name: 'Dr. Mehmood',
      role: 'Dentist',
      bio: 'Test dentist',
      isActive: true
    }
  });

  const existingService = await prisma.service.findFirst({
    where: { name: 'Teeth Cleaning', businessId: business.id }
  });

  const service = existingService || await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Teeth Cleaning',
      description: 'Test cleaning',
      durationMinutes: 45,
      price: 120,
      isActive: true
    }
  });

  const existingCustomer = await prisma.customer.findFirst({
    where: { phone: '+15551234567' }
  });

  const customer = existingCustomer || await prisma.customer.create({
    data: {
      name: 'John Doe',
      phone: '+15551234567',
      email: 'john@example.com'
    }
  });

  const link = await prisma.staffService.findFirst({
    where: { staffId: staff.id, serviceId: service.id }
  });

  if (!link) {
    await prisma.staffService.create({
      data: { staffId: staff.id, serviceId: service.id }
    });
  }

  const availability = await toolRegistry.check_availability.execute({
    businessId: business.id,
    staffId: staff.id,
    serviceId: service.id,
    startTime: new Date('2026-09-20T11:00:00.000Z'),
    endTime: new Date('2026-09-20T11:45:00.000Z')
  });

  if (!availability.available) {
    console.log('AVAILABILITY_BLOCKED', JSON.stringify(availability, null, 2));
    await prisma.$disconnect();
    process.exit(1);
  }

  const result = await toolRegistry.create_appointment.execute({
    businessId: business.id,
    customerPhone: customer.phone,
    staffId: staff.id,
    serviceId: service.id,
    startTime: new Date('2026-09-20T11:00:00.000Z'),
    endTime: new Date('2026-09-20T11:45:00.000Z'),
    notes: 'Real tool smoke test booking'
  });

  console.log(JSON.stringify({
    business: business.id,
    staff: staff.id,
    service: service.id,
    customer: customer.id,
    appointment: result.id,
    status: result.status,
    startTime: result.startTime,
    endTime: result.endTime,
    notes: result.notes
  }, null, 2));

  await prisma.$disconnect();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
