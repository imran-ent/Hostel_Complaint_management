import express from 'express';
import cors from 'cors';
import { getConnection, initializeDatabase } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize the database tables on startup
initializeDatabase();

// 1. Get all complaints
app.get('/api/complaints', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Fetch complaints
    const complaintsResult = await connection.execute(
      `SELECT * FROM HO_COMPLAINTS ORDER BY createdAt DESC`
    );
    
    // Fetch all votes
    const votesResult = await connection.execute(
      `SELECT * FROM HO_VOTES`
    );
    
    // Assemble the data exactly like our old local storage Mock
    const complaints = complaintsResult.rows.map(row => {
      const dbVotes = votesResult.rows.filter(v => v.COMPLAINTID === row.ID);
      const votedBy = dbVotes.map(v => v.VOTERID);
      
      return {
        id: row.ID,
        title: row.TITLE,
        description: row.DESCRIPTION,
        category: row.CATEGORY,
        studentId: row.STUDENTID,
        status: row.STATUS,
        upvotes: row.UPVOTES,
        createdAt: row.CREATEDAT,
        votedBy: votedBy
      };
    });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 2. Add a new complaint
app.post('/api/complaints', async (req, res) => {
  let connection;
  try {
    const { id, title, description, category, studentId, status, upvotes, createdAt } = req.body;
    connection = await getConnection();
    
    await connection.execute(
      `INSERT INTO HO_COMPLAINTS (id, title, description, category, studentId, status, upvotes, createdAt) 
       VALUES (:id, :title, :description, :category, :studentId, :status, :upvotes, :createdAt)`,
      { id, title, description, category, studentId, status, upvotes, createdAt }
    );
    
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add complaint' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 3. Mark solved
app.patch('/api/complaints/:id/solve', async (req, res) => {
  let connection;
  try {
    const complaintId = req.params.id;
    connection = await getConnection();
    
    // Update status
    await connection.execute(
      `UPDATE HO_COMPLAINTS SET status = 'solved' WHERE id = :id`,
      { id: complaintId }
    );
    
    // Create a notification for the student
    const complaintRow = await connection.execute(
      `SELECT studentId, title FROM HO_COMPLAINTS WHERE id = :id`,
      { id: complaintId }
    );
    
    if (complaintRow.rows.length > 0) {
      const studentId = complaintRow.rows[0].STUDENTID;
      const title = complaintRow.rows[0].TITLE;
      const notifId = Date.now().toString();
      
      await connection.execute(
        `INSERT INTO HO_NOTIFICATIONS (id, message, studentId) VALUES (:id, :msg, :studentId)`,
        { id: notifId, msg: `Your complaint "${title}" has been solved!`, studentId }
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark solved' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 4. Toggle Upvote
app.post('/api/complaints/:id/upvote', async (req, res) => {
  let connection;
  try {
    const complaintId = req.params.id;
    const { studentId, isUpvoting } = req.body;
    connection = await getConnection();
    
    if (isUpvoting) {
      await connection.execute(
        `INSERT INTO HO_VOTES (complaintId, voterId) VALUES (:cId, :vId)`,
        { cId: complaintId, vId: studentId }
      );
      await connection.execute(
        `UPDATE HO_COMPLAINTS SET upvotes = upvotes + 1 WHERE id = :id`,
        { id: complaintId }
      );
    } else {
      await connection.execute(
        `DELETE FROM HO_VOTES WHERE complaintId = :cId AND voterId = :vId`,
        { cId: complaintId, vId: studentId }
      );
      await connection.execute(
        `UPDATE HO_COMPLAINTS SET upvotes = upvotes - 1 WHERE id = :id`,
        { id: complaintId }
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle upvote' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 5. Get Notifications
app.get('/api/notifications/:studentId', async (req, res) => {
  let connection;
  try {
    const studentId = req.params.studentId;
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT * FROM HO_NOTIFICATIONS WHERE studentId = :studentId`,
      { studentId }
    );
    
    const notifs = result.rows.map(row => ({
      id: row.ID,
      message: row.MESSAGE,
      studentId: row.STUDENTID
    }));
    
    res.json(notifs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get notifications' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 6. Delete notification
app.delete('/api/notifications/:id', async (req, res) => {
  let connection;
  try {
    const id = req.params.id;
    connection = await getConnection();
    await connection.execute(
      `DELETE FROM HO_NOTIFICATIONS WHERE id = :id`,
      { id }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete notification' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
