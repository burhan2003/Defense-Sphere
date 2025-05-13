import socket, threading

PORT = 6971
EMP_LOGGEDIN = False

class Admin:

    def __init__(self):
        # Create a socket object
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Bind the socket to the host and port
        self.server_socket.bind(('0.0.0.0', PORT))
    
    def _listen_and_accept(self):
        # Listen for incoming connections
        self.server_socket.listen()
        # Accept the connection from client1
        self.client_socket, self.address = self.server_socket.accept()

    # Function to receive messages from client1
    def _receive_messages(self):
        while True:
            try:
                message = self.client_socket.recv(1024).decode('utf-8')
                if message:
                        print(message)
                        self.process_msg(message.split(' ', 1)[1])
            except Exception as e:
                print(f"Connection Lost: {e}")
                self._listen_and_accept()
    
    # Function to send messages to client1
    def send_message(self, msg:str):
            msg = f'[ADMIN] {msg}'
            self.client_socket.send(msg.encode('utf-8'))

    # process the recieved message
    def process_msg(self, msg:str):
        global EMP_LOGGEDIN
        if 'login: 'in msg:
            EMP_LOGGEDIN = True
        elif 'logout: ' in msg:
            EMP_LOGGEDIN = False


    def run(self):
        # Create threads for receiving and sending messages
        receive_thread = threading.Thread(target=self._receive_messages)
        send_thread = threading.Thread(target=self.send_message)

        # Start the threads
        receive_thread.start()
        send_thread.start()

class Employee:
    
    def __init__(self, admin_ip):
        # Create a socket object
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Connect to the server (employee)
        self.client_socket.connect((admin_ip, PORT))
    
    # Function to receive messages from employee
    def _receive_messages(self):
        while emp_active:
            message = self.client_socket.recv(1024).decode('utf-8')
            if message:
                print(f"[ADMIN] {message}")

    # Function to send messages to employee
    def send_message(self, msg:str):
        msg = f'[EMPLOYEE] {msg}'
        self.client_socket.send(msg.encode('utf-8'))

    def run(self):
        global emp_active
        emp_active = True
        # Create threads for receiving and sending messages
        receive_thread = threading.Thread(target=self._receive_messages)
        #! send_thread = threading.Thread(target=self.send_messages)

        # Start the threads
        receive_thread.start()
        #! send_thread.start()


if __name__ == "__main__":
    emp = Employee()
    emp.run()