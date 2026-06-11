-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER' NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create destinations table
CREATE TABLE IF NOT EXISTS "destination" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    region VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    main_attractions VARCHAR(255),
    image VARCHAR(255),
    estimated_visitors INTEGER DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    best_time_to_visit VARCHAR(255),
    entry_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create providers table
CREATE TABLE IF NOT EXISTS "provider" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    price DECIMAL(10,2),
    website VARCHAR(255),
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    destination_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES "destination"(id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS "booking" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    check_in_date TIMESTAMP NOT NULL,
    check_out_date TIMESTAMP NOT NULL,
    number_of_guests INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    user_id UUID NOT NULL,
    provider_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES "provider"(id) ON DELETE RESTRICT
);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS "access_log" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    ip VARCHAR(45) NOT NULL,
    event VARCHAR(50) NOT NULL,
    browser VARCHAR(100),
    user_agent TEXT,
    module VARCHAR(100),
    resource VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_users_email ON "user"(email);
CREATE INDEX idx_destinations_region ON "destination"(region);
CREATE INDEX idx_destinations_category ON "destination"(category);
CREATE INDEX idx_providers_destination_id ON "provider"(destination_id);
CREATE INDEX idx_bookings_user_id ON "booking"(user_id);
CREATE INDEX idx_bookings_provider_id ON "booking"(provider_id);
CREATE INDEX idx_access_logs_user_id ON "access_log"(user_id);
CREATE INDEX idx_access_logs_created_at ON "access_log"(created_at);

-- Insert test admin user
INSERT INTO "user" (email, password, first_name, last_name, role) 
VALUES (
    'admin@bolivia-tours.com',
    '$2a$10$YourHashedPasswordHere', -- bcrypt hash of Admin123!@
    'Admin',
    'System',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample destinations
INSERT INTO "destination" (name, region, category, description, entry_fee)
VALUES 
    ('Salar de Uyuni', 'Potosí', 'NATURAL', 'El mayor salar del mundo', 50),
    ('La Paz', 'La Paz', 'URBAN', 'Capital administrativa de Bolivia', 20),
    ('Isla del Sol', 'La Paz', 'CULTURAL', 'Isla sagrada en el Lago Titicaca', 30),
    ('Parque Madidi', 'Beni', 'ADVENTURE', 'Área biodiversa del mundo', 60),
    ('Potosí', 'Potosí', 'CULTURAL', 'Montaña emblemática', 35)
ON CONFLICT DO NOTHING;

COMMIT;
