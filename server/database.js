import oracledb from 'oracledb';

// Credentials you provided
const dbConfig = {
  user: 'hr',
  password: 'hr',
  // You might need to change 'XE' to 'ORCL' depending on your Oracle service name
  connectionString: 'localhost/XE' 
};

// We enable outFormat = OBJECT so rows come back as JS objects instead of arrays
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
    throw err;
  }
}

async function initializeDatabase() {
  let connection;
  try {
    connection = await getConnection();

    // Create Complaints table
    const createComplaintsTable = `
      CREATE TABLE HO_COMPLAINTS (
        id VARCHAR2(100) PRIMARY KEY,
        title VARCHAR2(255) NOT NULL,
        description VARCHAR2(1000) NOT NULL,
        category VARCHAR2(100) NOT NULL,
        studentId VARCHAR2(100) NOT NULL,
        status VARCHAR2(20) DEFAULT 'pending',
        upvotes NUMBER DEFAULT 0,
        createdAt VARCHAR2(100) NOT NULL
      )
    `;

    // Create VotedBy table since Oracle isn't a NoSQL doc db, we need a relation for array `votedBy`
    const createVotesTable = `
      CREATE TABLE HO_VOTES (
        complaintId VARCHAR2(100),
        voterId VARCHAR2(100),
        PRIMARY KEY (complaintId, voterId)
      )
    `;

    // Create Notifications table
    const createNotifsTable = `
      CREATE TABLE HO_NOTIFICATIONS (
        id VARCHAR2(100) PRIMARY KEY,
        message VARCHAR2(500) NOT NULL,
        studentId VARCHAR2(100) NOT NULL
      )
    `;

    // Helper to run creation and ignore "already exists" errors (ORA-00955)
    async function executeSafe(sql) {
      try {
        await connection.execute(sql);
        console.log('Table created successfully.');
      } catch (err) {
        if (err.errorNum !== 955) { // 955 = name is already used
            console.warn('Startup query issue:', err.message);
        }
      }
    }

    await executeSafe(createComplaintsTable);
    await executeSafe(createVotesTable);
    await executeSafe(createNotifsTable);

    console.log('Oracle Database Initialized!');
  } catch (err) {
    console.error('Failed to initialize db:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export {
  getConnection,
  initializeDatabase
};
