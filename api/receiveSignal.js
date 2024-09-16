// This will store the current signal (buy or close)
let currentSignal = null;

export default function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    // Extract the action from the request body (buy or close)
    const { action } = req.body;

    // Validate the action: it should only be 'buy' or 'close'
    if (action === 'buy' || action === 'close') {
      currentSignal = action;  // Store the signal
      console.log(`Received action: ${action}`);
      res.status(200).json({ message: `Signal received: ${action}` });
    } else {
      res.status(400).json({ error: 'Invalid action. Expected "buy" or "close".' });
    }
  } else if (req.method === 'GET') {
    // If it's a GET request, return the current signal to the second bot
    if (currentSignal) {
      res.status(200).json({ action: currentSignal });
      currentSignal = null;  // Reset signal after it has been consumed
    } else {
      res.status(200).json({ action: 'none' });
    }
  } else {
    // Method not allowed for other request types
    res.setHeader('Allow', ['POST', 'GET', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
