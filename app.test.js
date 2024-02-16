const ioClient = require('socket.io-client');

describe('Chat App Tests', () => {
  let socket;

  // Setup a socket connection before each test
  beforeEach((done) => {
    // Connect to the server using a dynamic port
    // socket = ioClient.connect('XXXXXXXXXXXXXXXXXXXXX');
    // socket = ioClient.connect('http://localhost:3000');

      // Construct the GitHub Actions URL
      const githubServerUrl = process.env.GITHUB_SERVER_URL;
      const githubRunId = process.env.GITHUB_RUN_ID;
      const githubUrl = `${githubServerUrl}/${githubRunId}`;
   
      // Connect to the server
      socket = ioClient.connect(githubUrl);

    // Handle connection event
    socket.on('connect', () => {
      done();
    });

    // Handle error event
    socket.on('connect_error', (error) => {
      done(error);
    });
  });

  // Close the socket connection after each test
  afterEach(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  });

  // Test sending and receiving messages
  test('Send and receive messages', (done) => {
    const messageToSend = 'Hello, world!';
    
    // Listen for new messages
    socket.on('new_message', (receivedMessage) => {
      // Check if the received message matches the sent message
      expect(receivedMessage).toBe(messageToSend);
      done(); // Signal that the test is complete
    });

    // Send a message
    socket.emit('message', messageToSend);
  });
});