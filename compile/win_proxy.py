import winreg as reg
import argparse
import sys

def set_proxy(enable, proxy_host=None, proxy_port=None):
    registry_path = r"Software\Microsoft\Windows\CurrentVersion\Internet Settings"

    try:
        with reg.OpenKey(reg.HKEY_CURRENT_USER, registry_path, 0, reg.KEY_SET_VALUE) as key:
            if enable:
                reg.SetValueEx(key, "ProxyEnable", 0, reg.REG_DWORD, 1)
                if proxy_host and proxy_port:
                    proxy_server = f"{proxy_host}:{proxy_port}"
                    reg.SetValueEx(key, "ProxyServer", 0, reg.REG_SZ, proxy_server)
                else:
                    print("Proxy host and port must be specified to enable the proxy.")
                    sys.exit(1)
            else:
                reg.SetValueEx(key, "ProxyEnable", 0, reg.REG_DWORD, 0)
                reg.SetValueEx(key, "ProxyServer", 0, reg.REG_SZ, "")

        print("Proxy settings updated successfully.")
    except Exception as e:
        print(f"Failed to update proxy settings: {e}")

def main():
    parser = argparse.ArgumentParser(description="Enable or disable system-wide proxy settings.")
    parser.add_argument("--enable", action="store_true", help="Enable the proxy.")
    parser.add_argument("--disable", action="store_true", help="Disable the proxy.")
    parser.add_argument("--host", type=str, help="Proxy host (required when enabling).")
    parser.add_argument("--port", type=str, help="Proxy port (required when enabling).")

    args = parser.parse_args()

    if args.enable and args.disable:
        print("Cannot enable and disable the proxy at the same time.")
        sys.exit(1)

    if args.enable:
        if not args.host or not args.port:
            print("Both --host and --port must be specified when enabling the proxy.")
            sys.exit(1)
        set_proxy(enable=True, proxy_host=args.host, proxy_port=args.port)
    elif args.disable:
        set_proxy(enable=False)
    else:
        print("You must specify either --enable or --disable.")
        sys.exit(1)

if __name__ == "__main__":
    main()
