# Swing Dance Festivals Map
This project uses the information curated and made available to the community by the amazing 
[Swing Plan It](https://www.swingplanit.com/) website to build an [Interactive Map](https://dnunessandro.github.io/swing-dance-festivals-map/) of all the Swing Dance Festivals
in the world!

Visuals developed using [Tableau Public](https://public.tableau.com/s/).<br>
Data scraping and processing developed using Python 3 / [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/).<br>
Geo Location data provided by [GeoCage Geocoder](https://opencagedata.com/api).

## Scraping Service
This scraping service accesses the [Swing Plan It](https://www.swingplanit.com/) website and the scrapes the relevant 
data to build the map visuals. In order to get the geo location coordinates that allow the festivals locations to be 
plotted on the map, the script calls the [GeoCage Geocoder API](https://opencagedata.com/api) for each festival 
location. Thus, you need to register and get an API key before running the service. Obtaining and API key should take
you 2 minutes and it's free (limited to 2000 API calls per month).
### Running the service

1. Navigate to the scraping service directory:
 ```
cd scraping-service
```

2. Activate the Python Environment:
```
source venv/bin/activate
```

3. Run the script:
```
python scraping-service.py -k [YOUR_API_KEY]
```

If everything went well, you should see the script output its progress on the command line. When finished, a 
`festivals.json` file will be created. To update the map, replace the `festivals.json` file currently serving the
map by the newly created one, refresh the data inside *Tableau Public* (`⌘ + R` on Mac or `Ctrl+R` on Windows) and save
the workbook to the Tableau servers.