const { sequelize } = require('./config/database');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');

        // Try to drop the old 'active' column from Jobs table
        try {
            await sequelize.query('ALTER TABLE `Jobs` DROP COLUMN `active`;');
            console.log('✓ Dropped active column from Jobs table');
        } catch (err) {
            if (err.original && err.original.errno === 1091) {
                console.log('✓ Active column already removed or does not exist');
            } else {
                throw err;
            }
        }

        console.log('\nMigration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
