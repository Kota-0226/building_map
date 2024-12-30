import requests

def get_lat_lon_from_address(address, api_key):
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['results']:
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
    return None, None

# Google Maps Geocoding APIキーを入力
api_key = "AIzaSyCcs1USXI0vSRyM8_kONvulZU13zX5FsOw"
address = "北海道帯広市西2条南14-3-1"
latitude, longitude = get_lat_lon_from_address(address, api_key)

if latitude and longitude:
    print(f"緯度: {latitude}, 経度: {longitude}")
else:
    print("住所から緯度・経度を取得できませんでした。")
