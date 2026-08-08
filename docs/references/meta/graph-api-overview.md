![](https://facebook.com/security/hsts-pixel.gif?c=3.2.5)

[Graph API](https://developers.facebook.com/docs/graph-api)

*   [Übersicht](https://developers.facebook.com/docs/graph-api/overview)
    
*   [Erste Schritte](https://developers.facebook.com/docs/graph-api/get-started)
    
*   [Batch-Anfragen](https://developers.facebook.com/docs/graph-api/batch-requests)
    
*   [Debuggen von Anfragen](https://developers.facebook.com/docs/graph-api/guides/debugging)
    
*   [Behandlung von Fehlern](https://developers.facebook.com/docs/graph-api/guides/error-handling)
    
*   [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
    
*   [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
    
*   [Änderungsprotokoll](https://developers.facebook.com/docs/graph-api/changelog)
    
*   [Reference](https://developers.facebook.com/docs/graph-api/reference)
    

Graph API – Übersicht
=====================

Die Graph API ist die gängigste Methode, mit der du Daten in die Facebook-Plattform einliest und daraus abrufst. Dabei handelt es sich um eine HTTP-basierte API, mit der du programmgesteuert Daten abfragen, neue Stories posten, Werbeanzeigen verwalten, Fotos hochladen und zahlreiche andere Aufgaben ausführen kannst.

Die Graph API erhält ihren Namen vom Konzept eines „Social Graphs“, einer Darstellung der Informationen auf Facebook. Sie besteht aus Nodes, Edges und Feldern. Normalerweise verwendest du Nodes, um Daten über ein spezifisches Objekt abzurufen; du verwendest Edges, um Sammlungen von Objekten zu einem einzelnen Objekt abzurufen; und du nutzt Felder, um Daten zu einem einzelnen Objekt oder einzelnen Objekten in einer Sammlung abzurufen. Im Rahmen dieser Dokumentation werden sowohl Nodes als auch Edges als „Endpunkte“ bezeichnet. Beispielsweise könnte eine Anweisung lauten: „Eine `GET`\-Abfrage an den Benutzerendpunkt senden“.

HTTP
----

Alle Datenübertragungen entsprechen HTTP/1.1; für alle Endpunkte ist HTTPS erforderlich. Da die Graph API HTTP-basiert ist, funktioniert sie mit jeder Sprache, die eine HTTP-Bibliothek aufweist, beispielsweise cURL und urllib. Das heißt, du kannst die Graph API direkt in deinem Browser verwenden. Wenn du beispielsweise die folgende URL in deinem Browser abrufst ...

[https://graph.facebook.com/facebook/picture?redirect=false](https://graph.facebook.com/facebook/picture?redirect=false)

... entspricht dies dieser cURL-Abfrage:

curl -i -X GET "https://graph.facebook.com/facebook/picture?redirect=false"

Wir haben außerdem die `includeSubdomains`\-HSTS-Direktive auf `facebook.com` aktiviert. Hierdurch sollten Graph API-Anfragen nicht beeinträchtigt werden.

Host-URL
--------

Fast alle Anfragen werden an die Host-URL `graph.facebook.com` übergeben.

Zugriffstoken
-------------

Deine App kann über Zugriffstoken auf die Graph API zugreifen. Nahezu alle Graph API-Endpunkte erfordern einen bestimmten Zugriffstoken. Daher muss deine Anfrage bei jedem Zugriff auf einen Endpunkt einen Zugriffstoken enthalten. Zugriffstoken führen in der Regel zwei Funktionen aus:

*   Deine App kann auf die Informationen eines\*einer Nutzer\*in zugreifen, ohne dass das Passwort des\*der Nutzer\*in erforderlich ist. Beispielsweise benötigt deine App die E-Mail-Adresse eines\*einer Nutzer\*in, um eine Funktion auszuführen. Wenn der\*die Nutzer\*in deiner App gestattet, seine\*ihre E-Mail-Adresse von Facebook abzurufen, muss er\*sie das Facebook-Passwort in deiner App nicht mehr eingeben.
    
*   Sie ermöglichen es, deine App, den\*die Nutzer\*in, der\*die deine App verwendet, und die Art der Daten zu identifizieren, auf die der\*die Nutzer\*in deiner App Zugriff gewährt.
    

Weitere Informationen hierzu findest du in der [Dokumentation zu Zugriffstoken](https://developers.facebook.com/docs/facebook-login/access-tokens)
.

Nodes
-----

Ein Node ist ein einzelnes Objekt mit einer eindeutigen ID. Es gibt beispielsweise viele Nutzer\*innen-Node-Objekte, wobei jedes eine eindeutige ID einer Person auf Facebook aufweist. Seiten, Posts, Fotos und Kommentare sind nur einige Beispiele für Nodes im Facebook Social Graph.

Das folgende cURL-Beispiel stellt einen Aufruf des Nutzer\*innen-Nodes dar.

curl -i -X GET \\
  "https://graph.facebook.com/USER-ID?access\_token=ACCESS-TOKEN"

Bei der Abfrage werden standardmäßig die folgenden Daten zurückgegeben, die in JSON formatiert sind:

{
  "name": "Your Name",
  "id": "YOUR-USER-ID"
}

### Node-Metadaten

Der Parameter `metadata` wird in Graph API v25.0 nicht mehr unterstützt und gibt keine Metadaten mehr über den Ziel-Node zurück. Verwende stattdessen den [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
 oder API-Referenzen. Der Parameter wird für alle Versionen am 19. Mai 2026 eingestellt.

Du kannst für ein Node-Objekt wie eine\*n Nutzer\*in, Seite oder Foto eine Liste aller Felder abrufen, einschließlich Feldname, Beschreibung und Datentyp. Sende dazu eine `GET`\-Abfrage an eine Objekt-ID und nimm darin den `metadata=1`\-Parameter auf:

curl -i -X GET \\
  "https://graph.facebook.com/USER-ID?
    metadata=1&access\_token=ACCESS-TOKEN"

Die resultierende JSON-Antwort umfasst eine `metadata`\-Eigenschaft, die alle unterstützten Felder für den jeweiligen Node auflistet:

{
  "name": "Jane Smith",
  "metadata": {
    "fields": \[\
      {\
        "name": "id",\
        "description": "The app user's App-Scoped User ID. This ID is unique to the app and cannot be used by other apps.",\
        "type": "numeric string"\
      },\
      {\
        "name": "age\_range",\
        "description": "The age segment for this person expressed as a minimum and maximum age. For example, more than 18, less than 21.",\
        "type": "agerange"\
      },\
      {\
        "name": "birthday",\
        "description": "The person's birthday.  This is a fixed format string, like \`MM/DD/YYYY\`.  However, people can control who can see the year they were born separately from the month and day so this string can be only the year (YYYY) or the month + day (MM/DD)",\
        "type": "string"\
      },\
...\
\
/me\
---\
\
Der `/me`\-Node ist ein besonderer Endpunkt, der der Objekt-ID der Person oder Seite entspricht, deren Zugriffstoken gerade für die API-Aufrufe verwendet wird. Mit einem Nutzer\*innen-Zugriffstoken könntest du wie folgt den Namen und die ID von Nutzer\*innen abrufen:\
\
curl -i -X GET \\\
  "https://graph.facebook.com/me?access\_token=ACCESS-TOKEN"\
\
Edges\
-----\
\
Eine Edge ist eine Verbindung zwischen zwei Nodes. Beispielsweise können mit einem Nutzer\*innen-Node Fotos und mit einem Foto-Node Kommentare verknüpft sein. Mit dem folgenden cURL-Beispiel wird eine Liste von Fotos zurückgegeben, die eine Person auf Facebook veröffentlicht hat.\
\
curl -i -X GET \\\
  "https://graph.facebook.com/USER-ID/photos?access\_token=ACCESS-TOKEN"\
\
Jede zurückgegebene ID stellt einen Foto-Node mit der entsprechenden Upload-Zeit auf Facebook dar.\
\
    {\
  "data": \[\
    {\
      "created\_time": "2017-06-06T18:04:10+0000",\
      "id": "1353272134728652"\
    },\
    {\
      "created\_time": "2017-06-06T18:01:13+0000",\
      "id": "1353269908062208"\
    }\
  \],\
}\
\
Felder\
------\
\
Felder sind Node-Eigenschaften. Wenn du eine Abfrage an einen Node oder eine Edge sendest, gibt diese(r) standardmäßig verschiedene Felder zurück – wie in den Beispielen oben gezeigt. Du kannst jedoch angeben, welche Felder zurückgegeben werden sollen, indem du für jedes Feld den `fields`\-Parameter und Listen verwendest. Damit wird die Standardeinstellung überschrieben und es werden nur die von dir definierten Felder zurückgegeben. Darüber hinaus wird die ID des Objekts zurückgegeben (diese wird immer zurückgegeben).\
\
Die folgende cURL-Abfrage enthält den `fields`\-Parameter sowie den Namen, die E-Mail-Adresse und das Profilbild des Nutzers bzw. der Nutzerin.\
\
curl -i -X GET \\\
  "https://graph.facebook.com/USER-ID?fields=id,name,email,picture&access\_token=ACCESS-TOKEN"\
\
#### Zurückgegebene Daten\
\
{\
  "id": "USER-ID",\
  "name": "EXAMPLE NAME",\
  "email": "EXAMPLE@EMAIL.COM",\
  "picture": {\
    "data": {\
      "height": 50,\
      "is\_silhouette": false,\
      "url": "URL-FOR-USER-PROFILE-PICTURE",\
      "width": 50\
    }\
  }\
}\
\
### Komplexe Parameter\
\
Die meisten Parametertypen sind ganz normale Primitive, wie `bool`, `string` und `int`. Es gibt aber auch `list`\- und `object`\-Typen, die in der Anfrage angegeben werden können.\
\
Der `list`\-Typ wird in JSON-Syntax angegeben, wie: `["firstitem", "seconditem", "thirditem"]`\
\
Der `object`\-Typ wird ebenfalls in JSON-Syntax angegeben, wie: `{"firstkey": "firstvalue", "secondKey": 123}`\
\
Veröffentlichung, Aktualisierung und Löschung\
---------------------------------------------\
\
In unserem [Facebook-Leitfaden zum Teilen](https://developers.facebook.com/docs/sharing)\
 erfährst du, wie du Inhalte im Facebook-Bereich eines\*einer Nutzer\*in veröffentlichst. In der [Pages API-Dokumentation](https://developers.facebook.com/docs/pages)\
 hingegen erfährst du, wie du Inhalte im Facebook-Feed einer Seite veröffentlichst.\
\
In einigen Nodes kannst du Felder über `POST`\-Vorgänge aktualisieren. So könntest du beispielsweise dein `email`\-Feld folgendermaßen aktualisieren:\
\
curl -i -X POST \\\
  "https://graph.facebook.com/USER-ID?email=YOURNEW@EMAILADDRESS.COM&access\_token=ACCESS-TOKEN"\
\
### Read-After-Write\
\
Für Erstellungs- und Aktualisierungsendpunkte kann die Graph API ein erfolgreich veröffentlichtes oder aktualisiertes Objekt sofort lesen und alle Felder zurückgeben, die vom jeweiligen Leseendpunkt unterstützt werden.\
\
Standardmäßig wird eine ID des erstellten oder aktualisierten Objekts zurückgegeben. Um weitere Informationen in die Antwort aufzunehmen, musst du den `fields`\-Parameter in deine Anfrage aufnehmen und die Felder auflisten, die zurückgegeben werden sollen. Um beispielsweise die Nachricht „Hello“ im Feed einer Seite zu veröffentlichen, könntest du die folgende Anfrage senden:\
\
curl -i - X POST "https://graph.facebook.com/PAGE-ID/feed?message=Hello&\
  fields=created\_time,from,id,message&access\_token=ACCESS-TOKEN"\
\
_Wir haben das obige Code-Beispiel für eine bessere Lesbarkeit formatiert._\
\
Dabei werden die angegebenen Felder als Antwort im JSON-Format zurückgegeben. Dies sieht wie folgt aus:\
\
{\
  "created\_time": "2017-04-06T22:04:21+0000",\
  "from": {\
    "name": "My Facebook Page",\
    "id": "PAGE-ID"\
  },\
  "id": "POST\_ID",\
  "message": "Hello",\
}\
\
In der [Referenzdokumentation](https://developers.facebook.com/docs/graph-api/reference)\
 für die einzelnen Endpunkte kannst du herausfinden, ob ein Endpunkt **read-after-write** unterstützt und welche Felder verfügbar sind.\
\
#### Fehler\
\
Wenn der Lesevorgang aus irgendeinem Grund fehlschlägt (wenn beispielsweise ein nicht vorhandenes Feld angefragt wird), gibt die Graph API eine standardmäßige Fehlermeldung zurück. In unserem [Leitfaden zum Behandeln von Fehlern](https://developers.facebook.com/docs/graph-api/guides/error-handling)\
 findest du weitere Informationen.\
\
Ein Node wie beispielsweise ein Post- oder Foto-Node lässt sich normalerweise löschen, indem du für die Objekt-ID einen DELETE-Vorgang ausführst:\
\
curl -i -X DELETE \\\
  "https://graph.facebook.com/PHOTO-ID?access\_token=ACCESSS-TOKEN"\
\
In der Regel kannst du nur Nodes löschen, die du selbst erstellt hast. Eine ausführliche Erläuterung zu den Anforderungen für Löschvorgänge findest du in der Referenz der einzelnen Nodes.\
\
Webhooks\
--------\
\
Du kannst Benachrichtigungen über Änderungen an Nodes oder Interaktionen mit Nodes erhalten, indem du Webhooks abonnierst. Siehe [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks)\
.\
\
Versionen\
---------\
\
Die Graph API hat mehrere Versionen, die vierteljährlich veröffentlicht werden. Du kannst in deinen Aufrufen die Version angeben, indem du dem Pfad der Anfrage ein "v" und die gewünschte Versionsnummer voranstellst. Hier siehst du einen Beispielaufruf für Version 4.0:\
\
curl -i -X GET \\\
  "https://graph.facebook.com/v4.0/USER-ID/photos\
    ?access\_token=ACCESS-TOKEN"\
\
Wenn du keine Versionsnummer einbindest, wird standardmäßig die älteste verfügbare Version verwendet. Aus diesem Grund empfiehlt es sich, eine Versionsnummer in deinen Anfragen anzugeben.\
\
Mehr zu unseren Versionen erfährst du in unserem [Leitfaden zur Versionierung](https://developers.facebook.com/docs/graph-api/guides/versioning)\
. Informationen zu allen verfügbaren Versionen sind im [Graph API-Änderungsprotokoll](https://developers.facebook.com/docs/graph-api/changelog)\
 zu finden.\
\
Facebook-APIs, -SDKs und -Plattformen\
-------------------------------------\
\
Mithilfe der verschiedenen [APIs, SDKs und Plattformen](https://developers.facebook.com/docs#apis-and-sdks)\
 von Facebook kannst du Schnittstellen einbinden und plattformübergreifend entwickeln.\
\
Nächste Schritte\
----------------\
\
[**Erste Schritte mit Graph API**](https://developers.facebook.com/docs/graph-api/get-started)\
 – Schauen wir uns einmal den Facebook Social Graph mit dem Graph Explorer-Tool näher an und führen einige Datenanfragen aus.