import geocoder
import webbrowser


def get_current_location() -> dict :
    """
    Function to get current url of the device/user
    """
    g = geocoder.ip('me')

    if g.latlng:
        latitude, longitude = g.latlng
        return {"lat":latitude, "long":longitude}
    else:
        return {}


def generate_url(destination: str) -> str:
    """
    Will Generate the url for google maps direction
    """
    destination = destination.replace(" ","+")
    coordinates = get_current_location()
    if coordinates:
        return f"https://www.google.com/maps/dir/?api=1&origin={coordinates['lat']},{coordinates['long']}&destination={destination}&travelmode=driving"
    else:
        return ""


def open_url(destination: str) -> None:
    """
    Opens Default System browser and displays the directions
    """
    webbrowser.open(generate_url(destination))


# Usages
if __name__ == '__main__':
    open_url("MGR Chennai Central")
