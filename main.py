from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse


def serve(port: int = 8000) -> None:
    """Start a simple static file server rooted at /public."""
    root = Path(__file__).parent / "public"
    root.mkdir(exist_ok=True)

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(root), **kwargs)

    httpd = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Serving {root} at http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        httpd.server_close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the Pomodoro web app.")
    parser.add_argument(
        "--port", type=int, default=8000, help="Port to bind the local server."
    )
    args = parser.parse_args()
    serve(port=args.port)


if __name__ == "__main__":
    main()
