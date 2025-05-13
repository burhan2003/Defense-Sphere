import socket, threading, struct, ipaddress, http.server, socketserver, os

# MAIN_PORT = 6969
MAIN_PORT = 5000
ADMIN_PORT = 6970
COMSOC_PORT = 6971

class NetworkScanner:

    """
    Manages the connections among active devices across the network
    """

    def __init__(self):
        self.active_ips = []

    def _get_local_ip(self):
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip

    def _get_subnet_mask(self):
        local_ip = self._get_local_ip()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        subnet_mask = socket.inet_ntoa(struct.pack('!I', struct.unpack('!I', socket.inet_aton(local_ip))[0] & struct.unpack('!I', socket.inet_aton('255.255.255.0'))[0]))
        return subnet_mask

    def _generate_ip_list(self):
        local_ip = self._get_local_ip()
        subnet = list(ipaddress.ip_network(f"{local_ip}/24", strict=False))
        subnet.remove(subnet[0])
        return [str(ip) for ip in subnet]

    
    def _check_connection(self, ip, port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            result = sock.connect_ex((ip, port))
            if result == 0:
                return self.active_ips.append(ip)
            sock.close()
        except:
            pass
        return None

    def scan_network(self):
        # generate ips within the network
        self._available_ips = self._generate_ip_list()

        # check for active connections
        self.active_ips, threads = [], []
        for ip in self._available_ips:
            t = threading.Thread(target=self._check_connection, args=(ip, MAIN_PORT))
            # t = threading.Thread(target=self._check_connection, args=(ip, COMSOC_PORT))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

    def _find_admin(self) -> str:

        def _scan(ip):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            result = sock.connect_ex((ip, ADMIN_PORT))
            if result == 0:
                global admin_ip
                admin_ip = ip
            sock.close()


        threads = []
        for ip in self.active_ips:
            t = threading.Thread(target=_scan, args=(ip,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        global admin_ip
        return admin_ip

    # def run(self):
        
    #     # scan the network for active ips
    #     self.scan_network()
    #     # find the admin_ip
    #     return self._find_admin()

class RemoteDirectory:

    def __init__(self):
        """
        This runs when the admin login is successfull
        """

        self._directory = os.path.dirname(os.path.abspath(__file__))
        self._handler = http.server.SimpleHTTPRequestHandler

    def _server_handler(self):
        with socketserver.TCPServer(("", ADMIN_PORT), self._handler) as self.httpd:
            print(f"Serving files from the directory: {self._directory}")
            print(f"Server running on port: {ADMIN_PORT}")
            self.httpd.serve_forever()

    def run(self):
        threading.Thread(target=self._server_handler).start()


if __name__ == "__main__":

    pass

    scanner = NetworkScanner()
    result = scanner.run()
    print(result)

    directory = RemoteDirectory()
    directory.run()