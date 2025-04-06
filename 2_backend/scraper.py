import requests
from bs4 import BeautifulSoup

def scrape_leads():
    # URL der Seite, die gescrapet werden soll
    url = "https://business-directory.at"  # Ersetze dies mit der tatsächlichen URL der Seite

    # HTTP GET Anfrage an die Seite senden
    response = requests.get(url)

    # Wenn die Antwort erfolgreich war, wird der Inhalt geparsed
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")

        # Liste, um alle extrahierten Leads zu speichern
        leads = []

        # Angenommen, jedes Lead ist in einem <div>-Tag mit der Klasse "lead-item"
        for lead_item in soup.find_all("div", class_="lead-item"):
            # Extrahieren der benötigten Daten für jedes Lead
            firma = lead_item.find("h2").text.strip()
            branche = lead_item.find("span", class_="branche").text.strip()
            website = lead_item.find("a", class_="website")["href"].strip()
            bewertung = int(lead_item.find("span", class_="bewertung").text.strip())
            status = "neu"  # Beispielstatus, könnte auch von der Seite stammen

            # Lead-Daten in die Liste hinzufügen
            leads.append({
                "firma": firma,
                "branche": branche,
                "website": website,
                "bewertung": bewertung,
                "status": status,
            })

        return leads

    else:
        print("Fehler beim Abrufen der Webseite:", response.status_code)
        return []

# Beispiel: Scrape Leads und ausgeben
leads = scrape_leads()
for lead in leads:
    print(lead)
