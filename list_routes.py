from main import app

def list_routes():
    routes = []
    
    for route in app.routes:
        if hasattr(route, 'methods'):
            routes.append(f"{route.path} {route.methods}")
        else:
            routes.append(f"{route.path} [MOUNT]")
    
    return routes

if __name__ == "__main__":
    for route in list_routes():
        print(route)
