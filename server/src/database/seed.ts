import bcrypt from 'bcryptjs';
import { pool } from '../config/db';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding for ARAN Integrated Technologies...');
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Seed Initial Admin if none exists
    const [existingAdmins]: any = await connection.query('SELECT id FROM admins WHERE email = ?', ['admin@aran-tech.com']);
    if (existingAdmins.length === 0) {
      const passwordHash = await bcrypt.hash('AranAdmin@2025', 10);
      await connection.query(
        `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        ['ARAN Administrator', 'admin@aran-tech.com', passwordHash, 'superadmin']
      );
      console.log('✅ Default admin account created: admin@aran-tech.com / AranAdmin@2025');
    }

    // 2. Seed Services
    const services = [
      {
        slug: 'cctv-surveillance-security',
        category: 'cctv',
        title: 'CCTV Surveillance & Security',
        tagline: 'High-definition AI-powered surveillance and 24/7 remote monitoring for commercial and residential facilities.',
        description: 'Complete industrial and commercial security surveillance architecture. We design, install, and service cutting-edge CCTV systems equipped with night-vision, AI motion recognition, multi-point IP cameras, and secure cloud monitoring accessible anywhere.',
        features: JSON.stringify([
          'CCTV camera installation',
          'Security system upgrades',
          'Remote monitoring setup',
          'Maintenance and troubleshooting',
          'Multi-channel NVR/DVR setup',
          'High-definition IP & PTZ cameras'
        ]),
        specs: JSON.stringify({
          resolution: '4K Ultra HD & 1080p Starlight',
          connectivity: 'PoE & Secure Cloud Remote',
          storage: 'RAID Supported 30-90 Day Archive',
          response: 'Real-time AI Motion & Intrusion Alerts'
        }),
        image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
        icon_name: 'Shield',
        sort_order: 1
      },
      {
        slug: 'solar-power-solutions',
        category: 'solar',
        title: 'Solar Power Solutions',
        tagline: 'High-efficiency photovoltaic systems delivering sustainable, resilient, cost-saving energy.',
        description: 'End-to-end solar energy infrastructure engineered for rooftop residential, commercial plants, and agricultural water pumping. We manage technical consultation, on-grid/off-grid installations, inverter synchronization, and long-term diagnostic servicing.',
        features: JSON.stringify([
          'Solar panel installation',
          'Solar system consultation',
          'Installation maintenance',
          'System inspection and troubleshooting',
          'On-Grid & Off-Grid Hybrid Inverters',
          'Net-metering & EB approvals assistance'
        ]),
        specs: JSON.stringify({
          efficiency: 'Tier-1 Mono PERC (>21.5% Efficiency)',
          inverters: 'Smart Hybrid MPPT Synchronization',
          lifespan: '25-Year Performance Warranty',
          payback: 'Estimated 3-4 Year Capital Recovery'
        }),
        image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
        icon_name: 'Sun',
        sort_order: 2
      },
      {
        slug: 'hydraulic-systems-automation',
        category: 'hydraulics',
        title: 'Hydraulic Systems & Automation',
        tagline: 'Heavy-duty industrial hydraulic engineering, precision fluid power, and factory automation.',
        description: 'Specialized engineering of custom hydraulic power units (HPUs), industrial cylinders, hydraulic presses, directional control valves, and automated electro-hydraulic control panels built for peak duty cycles and zero downtime.',
        features: JSON.stringify([
          'Hydraulic system installation',
          'Hydraulic equipment servicing',
          'Automation solutions',
          'Maintenance and technical support',
          'High-pressure cylinder refurbishment',
          'Hydraulic fluid filtration & testing'
        ]),
        specs: JSON.stringify({
          pressure: 'Up to 350+ Bar Heavy Duty Rating',
          valves: 'Proportional & Servo Directional Control',
          filtration: 'ISO 4406 Cleanliness Standard Compliance',
          automation: 'PLC Integrated Electro-Hydraulic Loops'
        }),
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        icon_name: 'Cpu',
        sort_order: 3
      }
    ];

    for (const service of services) {
      await connection.query(
        `INSERT INTO services (slug, category, title, tagline, description, features, specs, image_url, icon_name, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         title = VALUES(title),
         tagline = VALUES(tagline),
         description = VALUES(description),
         features = VALUES(features),
         specs = VALUES(specs),
         image_url = VALUES(image_url),
         icon_name = VALUES(icon_name)`,
        [
          service.slug,
          service.category,
          service.title,
          service.tagline,
          service.description,
          service.features,
          service.specs,
          service.image_url,
          service.icon_name,
          service.sort_order
        ]
      );
    }
    console.log('✅ Core services seeded.');

    // 3. Seed Verified Business Settings from Business Card
    const settings = [
      { key: 'company_name', value: 'ARAN Integrated Technologies', group: 'company' },
      { key: 'phone', value: '+91 90256 72856', group: 'contact' },
      { key: 'email', value: 'aranidts@gmail.com', group: 'contact' },
      { key: 'address', value: '10/264 A3, Kamaraj Nagar North, Pavoorchatram, Tenkasi District, Tamil Nadu 627808', group: 'contact' },
      { key: 'gstin', value: '33AABPX4889K3ZY', group: 'compliance' },
      { key: 'udyam', value: 'TN-37-0063266', group: 'compliance' },
      { key: 'whatsapp_number', value: '919025672856', group: 'contact' },
      { key: 'business_hours', value: 'Monday - Saturday: 9:00 AM - 7:00 PM | Sunday: Emergency On-Call', group: 'operations' },
      { key: 'google_maps_url', value: 'https://maps.google.com/?q=Pavoorchatram+Tenkasi+Tamil+Nadu', group: 'contact' }
    ];

    for (const s of settings) {
      await connection.query(
        `INSERT INTO business_settings (setting_key, setting_value, setting_group)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [s.key, s.value, s.group]
      );
    }
    console.log('✅ Business card settings verified and seeded.');

    // 4. Seed Representative Project Portfolio
    const projects = [
      {
        title: 'Industrial Warehouse 32-Channel IP Surveillance',
        category: 'cctv',
        description: 'Complete high-definition surveillance network with remote perimeter monitoring and AI motion detection.',
        client_type: 'Industrial Facility',
        location: 'Tenkasi District, Tamil Nadu',
        image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80',
        completion_date: 'Q3 2024',
        technical_specs: JSON.stringify({ cameras: '32 4K Dome & Bullet', storage: '64TB RAID NVR', remote: 'Mobile & Cloud Desk' }),
        is_featured: true
      },
      {
        title: 'Commercial Complex Perimeter CCTV Upgrade',
        category: 'cctv',
        description: 'Upgraded legacy analog system to high-resolution IP cameras with night vision and centralized monitoring desk.',
        client_type: 'Commercial Plaza',
        location: 'Pavoorchatram, Tamil Nadu',
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
        completion_date: 'Q4 2024',
        technical_specs: JSON.stringify({ cameras: '16 PTZ & Bullet', integration: 'Biometric Access Synergy' }),
        is_featured: true
      },
      {
        title: '15kW Commercial Grid-Tied Solar Plant',
        category: 'solar',
        description: 'High-efficiency rooftop solar photovoltaic system synchronized with grid net-metering for substantial energy reduction.',
        client_type: 'Manufacturing Plant',
        location: 'Tirunelveli Region, Tamil Nadu',
        image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
        completion_date: 'Q1 2025',
        technical_specs: JSON.stringify({ capacity: '15 kW', panels: 'Mono PERC Bifacial', inverter: 'Three Phase On-Grid' }),
        is_featured: true
      },
      {
        title: 'Agricultural Solar Water Pumping Installation',
        category: 'solar',
        description: 'Reliable off-grid solar power drive for deep borewell submersible pump with automated dry-run protection.',
        client_type: 'Agricultural Farm',
        location: 'Tenkasi District, Tamil Nadu',
        image_url: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1000&q=80',
        completion_date: 'Q2 2024',
        technical_specs: JSON.stringify({ pump_hp: '7.5 HP VFD Drive', solar_array: '10 kW Solar Array' }),
        is_featured: false
      },
      {
        title: 'Industrial Hydraulic Power Unit (HPU) Engineering',
        category: 'hydraulics',
        description: 'Custom engineered 300-bar hydraulic power pack with proportional pressure control and heat exchanger cooling loop.',
        client_type: 'Heavy Engineering Works',
        location: 'Industrial Zone, Tamil Nadu',
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        completion_date: 'Q4 2024',
        technical_specs: JSON.stringify({ pressure: '315 Bar', tank_capacity: '500 Liters', flow: '65 LPM' }),
        is_featured: true
      },
      {
        title: 'Automated Hydraulic Press Cylinder Refurbishment',
        category: 'hydraulics',
        description: 'Precision cylinder rod re-chroming, high-pressure seal replacement, and PLC-controlled stroke automation upgrade.',
        client_type: 'Metal Fabrication Unit',
        location: 'Tenkasi District, Tamil Nadu',
        image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
        completion_date: 'Q1 2025',
        technical_specs: JSON.stringify({ tonnage: '150 Ton Capacity', seals: 'Polyurethane High-Temp Seals' }),
        is_featured: false
      }
    ];

    const [existingProjects]: any = await connection.query('SELECT COUNT(*) as count FROM projects');
    if (existingProjects[0].count === 0) {
      for (const p of projects) {
        await connection.query(
          `INSERT INTO projects (title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.title, p.category, p.description, p.client_type, p.location, p.image_url, p.completion_date, p.technical_specs, p.is_featured]
        );
      }
      console.log('✅ Illustrative engineering projects seeded.');
    }

    await connection.commit();
    console.log('🚀 ARAN Database seeded successfully!');
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error during database seed:', err);
    throw err;
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
