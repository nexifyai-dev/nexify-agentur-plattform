import type { LegalPageData } from "./de";

const C = {
  legalName: "NeXify AI by NeXify – chat it. Automate it.",
  owner: "Pascal Courbois",
  address: "Graaf van Loonstraat 1E, 5921 JA Venlo, Nederland",
  email: "mail@nexifyai.cloud",
  phone: "+31 6 133 188 56",
  kvk: "90483944",
  vat: "NL865786276B01",
};

export const legalPagesNl: Record<string, LegalPageData> = {
  // NOTE: two parallel legal-page systems exist in this app (locale-prefixed
  // app/[locale]/* expecting `legalPagesNl`, and the legacy flat app/* tree
  // via components/legal-page.tsx expecting `legalNl`). Kept both exports in
  // sync here rather than picking a side — see master audit plan for the
  // route-tree consolidation decision.
  impressum: {
    slug: "impressum",
    title: "Colofon",
    intro: "Aanbiedersidentificatie en contactgegevens van NeXify AI by NeXify – chat it. Automate it.",
    updated: "Juni 2026",
    sections: [
      { heading: "Bedrijfsgegevens", paragraphs: [C.legalName, `Eenmanszaak naar Nederlands recht, eigenaar: ${C.owner}`, C.address] },
      { heading: "Contact", paragraphs: [`E-mail: ${C.email}`, `Telefoon: ${C.phone}`, "Web: nexifyai.cloud"] },
      {
        heading: "Registratie- en fiscale gegevens",
        paragraphs: [
          `Kamer van Koophandel (KvK): ${C.kvk}`,
          `Btw-identificatienummer: ${C.vat}`,
          "Werkterrein: IT-advies, AI-ondersteunde automatisering, softwareontwikkeling, webontwikkeling en e-commerce-oplossingen.",
        ],
      },
      {
        heading: "Vertegenwoordiging en redactionele verantwoordelijkheid",
        paragraphs: [`${C.owner}, eigenaar / directeur.`, `Verantwoordelijk voor redactionele inhoud: ${C.owner}, adres zoals hierboven.`],
      },
      {
        heading: "Toezicht en toepasselijk recht",
        paragraphs: [
          "Als in Nederland gevestigde eenmanszaak valt NeXify AI onder het Nederlandse handels- en ondernemingsrecht. Bevoegde kamer is de Kamer van Koophandel (KvK).",
          "Voor privacyrechtelijke aangelegenheden is de Autoriteit Persoonsgegevens (Den Haag) de bevoegde toezichthouder.",
        ],
      },
      {
        heading: "B2B-oriëntatie",
        paragraphs: [
          "Het aanbod richt zich uitsluitend op ondernemers, publiekrechtelijke rechtspersonen en vergelijkbare organisaties die handelen in de uitoefening van hun bedrijf of zelfstandig beroep. Overeenkomsten met consumenten worden niet gesloten.",
        ],
      },
      {
        heading: "Aansprakelijkheid voor inhoud",
        paragraphs: [
          "De inhoud van deze website wordt met de grootste zorg samengesteld en regelmatig geactualiseerd. Garantie voor juistheid, volledigheid en actualiteit wordt alleen gegeven voor zover uitdrukkelijk overeengekomen of wettelijk dwingend voorgeschreven.",
          "Prijsvermeldingen op deze website vormen geen bindend aanbod, maar een transparante oriëntatie. Bindend zijn uitsluitend individueel opgestelde en schriftelijk bevestigde offertes.",
        ],
      },
      {
        heading: "Aansprakelijkheid voor links",
        paragraphs: [
          "Gelinkte externe websites vallen onder de verantwoordelijkheid van hun respectieve beheerders. Op het moment van linken waren geen rechtsschendingen herkenbaar. Onrechtmatige inhoud wordt na kennisname en redelijke toetsing verwijderd of de link wordt beëindigd.",
        ],
      },
      {
        heading: "Auteursrecht",
        paragraphs: [
          "Alle inhoud, afbeeldingen, logo's en ontwerpelementen van deze website vallen onder het auteursrecht. Elk gebruik buiten de wettelijke grenzen vereist voorafgaande schriftelijke toestemming. Merk- en productnamen van derden zijn eigendom van hun respectieve houders.",
        ],
      },
      {
        heading: "Onlinegeschillenbeslechting",
        paragraphs: [
          "Aangezien NeXify AI uitsluitend B2B-diensten aanbiedt, bestaat er geen verplichting tot en geen deelname aan consumentengeschillenprocedures. Vragen over overeenkomsten of diensten kunnen rechtstreeks aan het bovengenoemde e-mailadres worden gericht.",
        ],
      },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    title: "Privacyverklaring",
    intro: "Uitgebreide informatie over de verwerking van persoonsgegevens op deze website, in de AI-chat en bij zakelijke aanvragen conform de AVG.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "1. Verwerkingsverantwoordelijke",
        paragraphs: [`${C.legalName}, ${C.address}.`, `Eigenaar: ${C.owner}. Contact: ${C.email}, ${C.phone}.`],
      },
      {
        heading: "2. Uitgangspunten van de verwerking",
        paragraphs: [
          "NeXify AI verwerkt persoonsgegevens doelgebonden, proportioneel en slechts zolang dit voor het betreffende doel, wettelijke verplichtingen of de behartiging van gerechtvaardigde belangen noodzakelijk is (art. 5 AVG).",
          "Deze website is in principe zonder gebruikersaccount en zonder marketing-tracking te gebruiken. Niet-noodzakelijke analyse- of advertentiecookies worden niet standaard ingezet.",
        ],
      },
      {
        heading: "3. Hosting, CDN en technische loggegevens",
        paragraphs: [
          "Bij het bezoeken van de website kunnen technisch noodzakelijke gegevens worden verwerkt, met name IP-adres, tijdstip, opgevraagde bron, referrer, browser-/apparaatinformatie en statuscodes. Dit dient de levering, stabiliteit, foutanalyse en bescherming tegen misbruik.",
          "Voor de levering en beveiliging van de website kunnen content-delivery- en beschermingsdiensten (bijv. Cloudflare) en hostinginfrastructuur (bijv. Vercel of eigen servers in de EU) worden ingezet. Met de aanbieders bestaan, voor zover vereist, verwerkersovereenkomsten.",
          "Rechtsgrond is art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij een veilig en functioneel webaanbod). Logs worden beperkt tot het noodzakelijke en na afloop van operationele of wettelijke vereisten verwijderd of geanonimiseerd.",
        ],
      },
      {
        heading: "4. Contactformulier en communicatie",
        paragraphs: [
          "Bij een aanvraag worden de door u verstrekte gegevens verwerkt, met name naam, bedrijf, contactgegevens, projectgegevens en bericht. Doel is de behandeling van de aanvraag, precontractuele communicatie en eventueel de uitvoering van de overeenkomst.",
          "Rechtsgronden zijn art. 6 lid 1 sub b AVG (precontractuele maatregelen resp. uitvoering van de overeenkomst) en art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij zorgvuldige B2B-communicatie). Verplichte velden zijn in het formulier gemarkeerd.",
          "Aanvraaggegevens worden opgeslagen in een beveiligde database (Supabase, PostgreSQL, serverlocatie EU).",
        ],
      },
      {
        heading: "5. AI-adviseur „NeXify AI” (livechat)",
        paragraphs: [
          "Op deze website is een AI-ondersteunde adviseur („NeXify AI”) beschikbaar. Bij gebruik van de chat worden uw chatberichten en een willekeurig gegenereerde sessie-ID verwerkt en opgeslagen om het gespreksverloop aan te bieden, aanvragen te kwalificeren en op verzoek een offerte op te stellen.",
          "Voor het genereren van antwoorden worden chatinhouden doorgegeven aan een AI-taalmodel (Large Language Model) van een gespecialiseerde aanbieder. Deel in de chat a.u.b. geen gevoelige of bijzondere persoonsgegevens. De chatinhouden worden niet vrijgegeven voor algemene modeltraining, tenzij uitdrukkelijk overeengekomen en wettelijk toegestaan.",
          "Geeft u in de chat vrijwillig naam, e-mailadres en bedrijf op om een offerte te ontvangen, dan worden deze gegevens gebruikt voor het opstellen en toezenden van de offerte en voor een passende zakelijke opvolging (follow-up-e-mail).",
          "Rechtsgronden: art. 6 lid 1 sub b AVG (precontractuele maatregelen op uw verzoek) en art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij efficiënt eerste advies). U bent niet verplicht de chat te gebruiken – alle vragen kunnen ook per e-mail of telefoon worden gesteld.",
          "Geheugenfunctie: Om terugkerende geïnteresseerden en klanten over meerdere contactmomenten heen individueel te kunnen adviseren, kunnen kerninhouden van gesprekken (bijv. branche, projectdoelen, voorkeuren) in verdichte vorm als notities worden opgeslagen. Hiervoor wordt de gespecialiseerde dienst Mem0 (Mem0 AI, VS) ingezet; de doorgifte vindt plaats op basis van EU-standaardcontractbepalingen (art. 46 lid 2 sub c AVG). Rechtsgrond voor de opslag is art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij gepersonaliseerde, efficiënte begeleiding). U kunt te allen tijde vormvrij bezwaar maken (mail@nexifyai.cloud); de notities worden dan gewist.",
          "Geen geautomatiseerde besluitvorming in de zin van art. 22 AVG: de AI-adviseur neemt geen besluiten met rechtsgevolgen of vergelijkbaar aanzienlijke gevolgen. Offertes zijn vrijblijvende indicaties en worden vóór het sluiten van een overeenkomst altijd door een mens gecontroleerd.",
        ],
      },
      {
        heading: "6. E-mailverzending en dienstverleners",
        paragraphs: [
          "Voor de technische verzending van formulierbevestigingen, offertes en transactionele e-mails wordt een gespecialiseerde e-maildienst (Resend) ingezet. Daarbij worden alleen de voor verzending, bezorging en misbruikbescherming noodzakelijke gegevens verwerkt (ontvangstadres, inhoud, bezorgstatus).",
          "Inkomende e-mails aan mail@nexifyai.cloud (postvak bij Hostinger) worden voor efficiënte afhandeling AI-ondersteund voorgesorteerd (bijv. herkenning van ongewenste reclame) en bij zakelijke aanvragen geautomatiseerd beantwoord. In het geautomatiseerde antwoordproces communiceert u met een AI-systeem; persoonlijke behandeling door Pascal Courbois vindt te allen tijde op verzoek plaats en bij alle zaken die menselijke beoordeling vereisen. Rechtsgronden: art. 6 lid 1 sub b en sub f AVG (efficiënte afhandeling van inkomende zakelijke communicatie).",
          "Interne CEO-agent (fabriek-aanbevelingen): Uit het onderwerp en de eerste regels van een zakelijke aanvraag wordt intern een gestructureerd offerte-concept (posities, prijs-schatting, vervolgvragen) door een AI-systeem gegenereerd en aan Pascal Courbois ter goedkeuring voorgelegd. Er vindt GEEN automatische offerteverzending plaats – de beslissing wordt uitsluitend door de mens genomen (art. 22 lid 1 AVG is daarmee niet van toepassing). Rechtsgrond: art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij snelle, kwaliteitsgeborgde offertevoorbereiding).",
          "Dienstverleners worden zorgvuldig geselecteerd, contractueel gebonden (art. 28 AVG) en alleen in de vereiste omvang ingezet. Bij doorgiften buiten de Europese Economische Ruimte worden passende waarborgen (bijv. EU-standaardcontractbepalingen) en aanvullende beschermingsmaatregelen getoetst.",
        ],
      },
      {
        heading: "7. Database en opslaglocaties",
        paragraphs: [
          "Aanvragen, chatgesprekken, leads en offertegegevens worden opgeslagen in een PostgreSQL-database van de aanbieder Supabase. De serverlocatie ligt in de Europese Unie. Toegang is versleuteld (TLS) en beperkt tot het noodzakelijke minimum.",
        ],
      },
      {
        heading: "8. Zakelijke contacten en B2B-projecten",
        paragraphs: [
          "In het kader van offertes en projecten kunnen contactpersoon-, contract-, communicatie-, facturatie- en projectgegevens worden verwerkt. Rechtsgronden zijn precontractuele maatregelen, uitvoering van de overeenkomst, wettelijke verplichtingen (met name fiscale bewaarplicht) en gerechtvaardigde belangen bij documentatie, kwaliteitsborging en juridische verdediging.",
        ],
      },
      {
        heading: "9. AI-ondersteunde verwerking in projecten",
        paragraphs: [
          "NeXify AI kan AI-ondersteunde tools inzetten voor structurering, concepten, ontwikkeling, tests en documentatie. Persoonsgegevens of vertrouwelijke gegevens worden alleen doorgegeven als dit voor het overeengekomen doel noodzakelijk, contractueel toegestaan en technisch passend beveiligd is.",
          "AI-uitvoer wordt niet ongecontroleerd als vakinhoudelijk bindende beslissing behandeld. Meer informatie vindt u onder „AI-verklaring”.",
        ],
      },
      {
        heading: "10. Bewaartermijnen",
        paragraphs: [
          "Aanvraag- en chatgegevens worden in principe bewaard zolang dit voor de behandeling en passende vervolgcommunicatie noodzakelijk is, en daarna verwijderd of geanonimiseerd.",
          "Contract- en facturatiegegevens worden conform wettelijke bewaarplichten (in Nederland doorgaans 7 jaar) bewaard. Gegevens kunnen langer worden bewaard indien dit noodzakelijk is voor het instellen, uitoefenen of verdedigen van rechtsvorderingen.",
        ],
      },
      {
        heading: "11. Uw rechten",
        bullets: [
          "Inzage in verwerkte persoonsgegevens (art. 15 AVG)",
          "Rectificatie van onjuiste of onvolledige gegevens (art. 16 AVG)",
          "Verwijdering, voor zover geen voorrang hebbende verplichtingen bestaan (art. 17 AVG)",
          "Beperking van de verwerking (art. 18 AVG)",
          "Overdraagbaarheid van gegevens (art. 20 AVG)",
          "Bezwaar tegen verwerkingen op grond van gerechtvaardigde belangen (art. 21 AVG)",
          "Intrekking van toestemming met werking voor de toekomst (art. 7 lid 3 AVG)",
          "Klacht bij een toezichthoudende autoriteit, met name de Autoriteit Persoonsgegevens (NL)",
        ],
      },
      {
        heading: "12. Beveiliging en actualisering",
        paragraphs: [
          "NeXify AI hanteert passende technische en organisatorische maatregelen, waaronder transportversleuteling (TLS), toegangsbeperkingen, dataminimalisatie en regelmatige updates. Geen enkele internetdienst kan echter absolute veiligheid garanderen.",
          "Deze verklaring wordt aangepast wanneer processen, dienstverleners of wettelijke vereisten dit vereisen. De op deze pagina gepubliceerde versie is telkens van toepassing.",
        ],
      },
    ],
  },
  agb: {
    slug: "agb",
    title: "Algemene voorwaarden (B2B)",
    intro: "Contractuele basis voor advies-, ontwikkelings-, design-, automatiserings- en beheerdiensten van NeXify AI.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "1. Toepassingsgebied en ondernemersstatus",
        paragraphs: [
          "Deze voorwaarden gelden voor alle overeenkomsten tussen NeXify AI en ondernemers, rechtspersonen of vergelijkbare organisaties die handelen in de uitoefening van hun bedrijf of zelfstandig beroep. Overeenkomsten met consumenten worden niet gesloten.",
          "Afwijkende voorwaarden van de opdrachtgever gelden alleen indien NeXify AI daar uitdrukkelijk schriftelijk mee instemt. Individuele contractuele afspraken hebben voorrang op deze voorwaarden.",
        ],
      },
      {
        heading: "2. Totstandkoming en omvang van de overeenkomst",
        paragraphs: [
          "Offertes zijn vrijblijvend, tenzij uitdrukkelijk als bindend aangeduid. Dit geldt ook voor automatisch gegenereerde offerte-indicaties van de NeXify AI adviseur, die altijd vrijblijvende oriëntaties vormen. Een overeenkomst komt tot stand door aanvaarding, opdrachtbevestiging of aanvang van de overeengekomen dienst.",
          "Bepalend zijn offerte, dienstbeschrijving, overeengekomen acceptatiecriteria en gedocumenteerde wijzigingen. Niet uitdrukkelijk inbegrepen diensten gelden als meerwerk.",
        ],
      },
      {
        heading: "3. Inspanning, werkdagen en prijs",
        paragraphs: [
          "Het reguliere dagtarief bedraagt € 999 netto per werkdag. Een werkdag omvat maximaal acht planbare vakuren.",
          "Urenramingen zijn schattingen op basis van de bekende omvang. Een bindende totaalprijs geldt alleen indien uitdrukkelijk overeengekomen. Bij gewijzigde eisen, ontbrekende content, externe blokkades of extra integraties wordt het meerwerk vóór uitvoering gemeld.",
          "Prijzen zijn exclusief toepasselijke omzetbelasting. Bij grensoverschrijdende B2B-diensten binnen de EU kan met een geldig btw-nummer de verleggingsregeling gelden.",
        ],
      },
      {
        heading: "4. Medewerking van de opdrachtgever",
        paragraphs: [
          "De opdrachtgever stelt content, toegangsgegevens, goedkeuringen, contactpersonen, juridische teksten en vakinhoudelijke beslissingen tijdig beschikbaar. Vertragingen of meerwerk door ontbrekende medewerking kunnen planning en prijs beïnvloeden.",
          "Toegangsgegevens dienen via overeengekomen veilige kanalen te worden verstrekt. Geheimen mogen niet ongevraagd in openbare tickets, chats of repositories worden geplaatst.",
        ],
      },
      {
        heading: "5. AI-ondersteunde werkwijze",
        paragraphs: [
          "NeXify AI zet moderne AI-ondersteunde ontwikkel-, analyse- en controletools in. Deze dienen versnelling en kwaliteitsborging. De vakinhoudelijke verantwoordelijkheid wordt niet aan een AI-systeem overgedragen.",
          "Voor zover de opdrachtgever bijzondere eisen heeft aan verwerking, modelkeuze, datalocatie of geheimhouding, moeten deze vóór projectstart worden gemeld en overeengekomen.",
        ],
      },
      {
        heading: "6. Termijnen en leveringstijden",
        paragraphs: [
          "Op de website genoemde richttijden (bijv. „website in 2–3 werkdagen”) betreffen pure uitvoeringstijd vanaf volledige aanlevering van alle vereiste content en goedkeuringen. Bindende termijnen vereisen uitdrukkelijke overeenkomst.",
          "Overmacht, storingen van derden en aan de opdrachtgever toe te rekenen vertragingen verlengen termijnen in redelijke mate.",
        ],
      },
      {
        heading: "7. Acceptatie",
        paragraphs: [
          "Acceptatieplichtige diensten worden na oplevering getoetst. Wezenlijke gebreken dienen navolgbaar en binnen de overeengekomen of redelijke termijn te worden gemeld. Onwezenlijke afwijkingen staan acceptatie niet in de weg.",
          "Productief gebruik, publicatie of uitblijvende terugkoppeling na een redelijke toetsingsperiode kan als acceptatie gelden, voor zover dit in de concrete overeenkomst toelaatbaar en aangekondigd is.",
        ],
      },
      {
        heading: "8. Gebruiksrechten en open source",
        paragraphs: [
          "Na volledige betaling verkrijgt de opdrachtgever de overeengekomen gebruiksrechten op het individueel gemaakte werk. Reeds bestaande tools, generieke componenten, frameworks, methoden en knowhow blijven bij hun respectieve rechthebbenden resp. NeXify AI.",
          "Open-source-componenten en diensten van derden vallen onder hun eigen licentie- en gebruiksvoorwaarden. Deze worden niet door de projectovereenkomst vervangen.",
        ],
      },
      {
        heading: "9. Derden en doorlopende kosten",
        paragraphs: [
          "Hosting, domeinen, betaalproviders, app-stores, externe API's, AI-model-gebruikskosten, licenties, transactie- en gebruikskosten zijn alleen inbegrepen indien uitdrukkelijk overeengekomen. Wijzigingen, storingen of beperkingen van derden liggen buiten de directe invloed van NeXify AI.",
        ],
      },
      {
        heading: "10. Garantie en aansprakelijkheid",
        paragraphs: [
          "NeXify AI herstelt reproduceerbare gebreken binnen een redelijke termijn. Geen softwareproduct is onder alle denkbare omstandigheden volledig foutloos; verschuldigd is de overeengekomen kwaliteit en vakkundige uitvoering.",
          "Onbeperkte aansprakelijkheid geldt bij opzet, grove nalatigheid, letsel aan leven, lichaam of gezondheid en dwingende wettelijke aansprakelijkheid. Bij licht nalatige schending van wezenlijke contractuele verplichtingen is de aansprakelijkheid beperkt tot de contracttypisch voorzienbare schade; overigens is aansprakelijkheid voor lichte nalatigheid uitgesloten.",
          "Voor gegevensverlies is NeXify AI slechts aansprakelijk in de omvang die ook bij correcte, regelmatige back-ups door de opdrachtgever zou zijn opgetreden.",
        ],
      },
      {
        heading: "11. Betaling",
        paragraphs: [
          "Facturen zijn binnen de vermelde termijn zonder aftrek betaalbaar. Bij grotere projecten kunnen termijnbetalingen, vooruitbetalingen of milestone-betalingen worden overeengekomen.",
          "Bij betalingsverzuim gelden de wettelijke B2B-gevolgen inclusief vertragingsrente en redelijke incasso- resp. proceskosten. NeXify AI kan diensten bij aanzienlijke betalingsachterstand na aankondiging opschorten.",
        ],
      },
      {
        heading: "12. Vertrouwelijkheid en gegevensbescherming",
        paragraphs: [
          "Beide partijen behandelen niet-openbare bedrijfs- en projectgegevens vertrouwelijk. De vertrouwelijkheid blijft na het einde van de overeenkomst voortbestaan.",
          "Voor zover NeXify AI persoonsgegevens in opdracht verwerkt, wordt een verwerkersovereenkomst conform art. 28 AVG gesloten (zie pagina „Verwerkersovereenkomst”).",
        ],
      },
      {
        heading: "13. Referentievermelding",
        paragraphs: [
          "NeXify AI mag de opdrachtgever na projectafronding met naam en logo als referentie vermelden, tenzij de opdrachtgever hiertegen bezwaar maakt of iets anders is overeengekomen. Vertrouwelijke projectdetails worden daarbij niet openbaar gemaakt.",
        ],
      },
      {
        heading: "14. Looptijd, opzegging en projectonderbreking",
        paragraphs: [
          "Projectovereenkomsten eindigen met de levering van de overeengekomen dienst. Doorlopende diensten kunnen conform de overeengekomen termijnen worden opgezegd. Het recht op buitengewone opzegging blijft bestaan.",
          "Bij onderbreking vanuit de verantwoordelijkheidssfeer van de opdrachtgever worden reeds geleverde diensten gefactureerd; een latere hervatting kan opnieuw worden ingepland.",
        ],
      },
      {
        heading: "15. Recht, bevoegde rechter en slotbepalingen",
        paragraphs: [
          "Nederlands recht is van toepassing met uitsluiting van het Weens Koopverdrag en conflictenrechtelijke verwijzingen, voor zover geen dwingende bepalingen zich daartegen verzetten. Bevoegde rechter voor B2B-opdrachtgevers is de vestigingsplaats van NeXify AI, voor zover toelaatbaar.",
          "Indien afzonderlijke bepalingen ongeldig zijn, blijft de geldigheid van de overige bepalingen onaangetast. In plaats van de ongeldige bepaling geldt de wettelijk toelaatbare regeling die het economische doel het dichtst benadert.",
        ],
      },
    ],
  },
  "ki-hinweise": {
    slug: "ki-hinweise",
    title: "AI-verklaring",
    intro: "Hoe NeXify AI moderne AI-tools inzet – transparant uitgelegd, inclusief de NeXify AI adviseur op deze website.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "AI-ondersteund in plaats van AI-uitbesteed",
        paragraphs: [
          "NeXify AI gebruikt AI-tools voor onderzoek, structurering, concepten, ontwikkelingsondersteuning, tests, vertalingen en documentatie. Deze tools versnellen werkstappen, maar vervangen geen vakinhoudelijke verantwoordelijkheid, controle en goedkeuring.",
        ],
      },
      {
        heading: "De NeXify AI adviseur op deze website",
        paragraphs: [
          "NeXify AI is een AI-ondersteunde advies- en salesassistent. Hij beantwoordt vragen over diensten en prijzen, kwalificeert aanvragen en kan op uitdrukkelijk verzoek een vrijblijvende offerte opstellen en per e-mail versturen.",
          "U communiceert daarbij met een geautomatiseerd systeem, niet met een mens. Alle door NeXify AI opgestelde offertes zijn vrijblijvende indicaties; bindende offertes worden uitsluitend door Pascal Courbois persoonlijk getoetst en bevestigd.",
          "De assistent beschikt over een geheugenfunctie: kerninhouden van gesprekken kunnen worden opgeslagen, zodat u bij een volgend contact niet opnieuw hoeft te beginnen. Daarnaast kunnen e-mails aan mail@nexifyai.cloud AI-ondersteund worden voorgesorteerd en beantwoord. Details en bezwaarmogelijkheden vindt u in de privacyverklaring.",
          "De AI-adviseur kan fouten maken. Bij onduidelijkheden of belangrijke beslissingen kunt u ons het beste rechtstreeks per e-mail of telefoon benaderen.",
        ],
      },
      {
        heading: "Menselijke controle",
        bullets: [
          "Doelen, architectuur en vakinhoudelijke beslissingen worden gestuurd door een verantwoordelijke vakman.",
          "AI-uitvoer wordt getoetst op plausibiliteit, veiligheid, projectcontext en kwaliteit.",
          "Juridische, fiscale, medische of andere hoogrisico-beslissingen worden niet uitsluitend op AI-uitvoer gebaseerd.",
          "Productieve wijzigingen worden conform het overeengekomen risico getest en gedocumenteerd.",
          "Automatisch gegenereerde offertes worden vóór contractsluiting altijd menselijk getoetst.",
        ],
      },
      {
        heading: "Data en vertrouwelijkheid",
        paragraphs: [
          "Vertrouwelijke gegevens of persoonsgegevens worden alleen in de vereiste omvang verwerkt. Model-, hosting- en dataverwerkingsroutes worden passend bij het project gekozen. Klantgegevens worden niet bewust vrijgegeven voor algemene modeltraining, tenzij uitdrukkelijk overeengekomen en wettelijk toegestaan.",
          "Details over de gegevensverwerking in de chat vindt u in de privacyverklaring, sectie „NeXify AI adviseur”.",
        ],
      },
      {
        heading: "EU AI Act en transparantie",
        paragraphs: [
          "NeXify AI volgt de vereisten van de EU-AI-verordening (AI Act) en implementeert de transparantieverplichtingen: gebruikers worden geïnformeerd wanneer zij met een AI-systeem communiceren, en AI-gegenereerde offerte-indicaties worden als zodanig gemarkeerd.",
          "Bij klantprojecten met AI-componenten adviseren wij over risicoclassificatie en de telkens geldende verplichtingen.",
        ],
      },
      {
        heading: "Grenzen",
        paragraphs: [
          "AI-systemen kunnen onvolledige, verouderde of onjuiste resultaten genereren. NeXify AI beperkt dit risico door bronnencontrole, tests, review, beperkte rechten en navolgbare werkstanden. Absolute foutloosheid kan niet worden gegarandeerd.",
        ],
      },
    ],
  },
  "cookie-richtlinie": {
    slug: "cookie-richtlinie",
    title: "Cookie- en opslagbeleid",
    intro: "Deze website is ingericht op datazuinig gebruik zonder standaard marketing-tracking.",
    updated: "Juni 2026",
    sections: [
      {
        heading: "Noodzakelijke opslagtechnieken",
        paragraphs: [
          "Technisch noodzakelijke cookies of lokale opslag (localStorage) kunnen worden ingezet om veiligheid, formulierstatussen, uw taalkeuze (Duits/Nederlands), de status van de chatassistent of elementaire websitefuncties aan te bieden. Zij dienen niet voor gedragsgerichte reclame.",
        ],
      },
      {
        heading: "Concreet ingezette opslag",
        bullets: [
          "nexify-lang (localStorage): slaat uw taalkeuze DE/NL op – tot verwijdering door u.",
          "nova-greeted (localStorage): onthoudt dat de chatassistent zich al heeft voorgesteld, om herhaald automatisch openen te voorkomen.",
          "nexify-consent (localStorage): slaat uw keuze in de cookiebanner op (categorieën en tijdstip van de beslissing) – tot verwijdering of wijziging door u.",
          "Sessie-ID van de chat: technische koppeling van uw gespreksverloop tijdens het gebruik.",
          "Inlogcookie van het klantportaal (HttpOnly): houdt uw sessie na het inloggen in stand; technisch noodzakelijk voor het portaal.",
        ],
      },
      {
        heading: "Uw cookie-instellingen (toestemmingsbeheer)",
        paragraphs: [
          "Bij uw eerste bezoek aan deze website kunt u via de cookiebanner kiezen welke categorieën u toestaat: „Noodzakelijk” (altijd actief), „Statistiek” en „Marketing”. Uw beslissing wordt uitsluitend lokaal in uw browser opgeslagen (nexify-consent) en niet aan derden doorgegeven.",
          "De categorieën Statistiek en Marketing staan standaard uit (opt-in in de zin van art. 6 lid 1 sub a AVG en art. 11.7a Telecommunicatiewet). Zolang u geen toestemming geeft, worden geen bijbehorende diensten geladen. Momenteel zet deze website in beide categorieën geen diensten in; zij zijn bedoeld voor mogelijke toekomstige uitbreidingen en zouden vóór activering hier transparant worden benoemd.",
          "U kunt uw keuze op elk moment met werking voor de toekomst wijzigen of intrekken: via de link „Cookie-instellingen” in de voettekst van elke pagina.",
        ],
      },
      {
        heading: "Geen standaard marketing-cookies",
        paragraphs: [
          "Zonder afzonderlijke aankondiging en toestemming worden geen niet-noodzakelijke advertentie-, retargeting- of platformoverstijgende tracking-cookies geplaatst. Wordt de website in de toekomst met dergelijke diensten uitgebreid, dan worden informatie en toestemmingsmechanisme vóór activering aangepast.",
        ],
      },
      {
        heading: "Diensten van derden",
        paragraphs: [
          "Voor de levering van de website kunnen CDN- en beschermingsdiensten (bijv. Cloudflare) technisch noodzakelijke cookies plaatsen die uitsluitend de veiligheid en lastverdeling dienen.",
        ],
      },
      {
        heading: "Browserinstellingen",
        paragraphs: [
          "U kunt cookies en lokale opslag via uw browser inzien, verwijderen of blokkeren. Bij technisch noodzakelijke opslag kunnen afzonderlijke functies (bijv. de taalkeuze) daardoor beperkt zijn.",
        ],
      },
    ],
  },
  avv: {
    slug: "avv",
    title: "Verwerkersovereenkomst",
    intro: "Uitgangspunten voor projecten waarin NeXify AI persoonsgegevens in opdracht van een klant verwerkt (art. 28 AVG).",
    updated: "Juni 2026",
    sections: [
      {
        heading: "Wanneer een verwerkersovereenkomst vereist is",
        paragraphs: [
          "Een verwerkersovereenkomst wordt gesloten wanneer NeXify AI persoonsgegevens uitsluitend volgens gedocumenteerde instructie van de klant verwerkt en aan de wettelijke voorwaarden van verwerking in opdracht is voldaan – bijvoorbeeld bij het beheer van web-apps, shops of automatiseringen met klantgegevens.",
        ],
      },
      {
        heading: "Typische onderdelen",
        bullets: [
          "Onderwerp, duur, aard en doel van de verwerking",
          "Categorieën betrokkenen en persoonsgegevens",
          "Instructie- en ondersteuningsprocessen",
          "Vertrouwelijkheidsverplichtingen van de ingezette personen",
          "Technische en organisatorische maatregelen (TOM)",
          "Regels voor subverwerkers en hun goedkeuring",
          "Ondersteuning bij rechten van betrokkenen en DPIA's",
          "Verwijdering, teruggave en bewijsvoering na contracteinde",
          "Meld- en ondersteuningsplichten bij datalekken",
          "Controle- en auditrechten van de verwerkingsverantwoordelijke",
        ],
      },
      {
        heading: "Typische subverwerkers",
        paragraphs: [
          "Afhankelijk van het project kunnen met name de volgende categorieën subverwerkers worden ingezet: hosting- en cloudinfrastructuur (bijv. Vercel, Hetzner, EU-datacenters), databasediensten (bijv. Supabase), e-mailverzenddiensten (bijv. Resend), CDN- en beveiligingsdiensten (bijv. Cloudflare) en – bij AI-functies – aanbieders van AI-taalmodellen.",
          "De concrete, projectgebonden lijst wordt in de betreffende verwerkersovereenkomst gedocumenteerd en actueel gehouden.",
        ],
      },
      {
        heading: "Technische en organisatorische maatregelen",
        bullets: [
          "Transportversleuteling (TLS) voor alle gegevensoverdrachten",
          "Toegangscontrole volgens het least-privilege-principe",
          "Gescheiden omgevingen voor ontwikkeling, test en productie",
          "Logging van veiligheidsrelevante gebeurtenissen",
          "Regelmatige updates en security-patches",
          "Dataminimalisatie en pseudonimisering waar mogelijk",
        ],
      },
      {
        heading: "Projectgebonden versie",
        paragraphs: [
          "Aangezien datatypen, systemen, hosting, subverwerkers en risico's per project verschillen, wordt de verwerkersovereenkomst projectgebonden opgesteld of aangevuld. Een actueel sjabloon en de bijbehorende technische en organisatorische maatregelen worden bij de opdracht ter beschikking gesteld.",
        ],
      },
    ],
  },
  widerruf: {
    slug: "widerruf",
    title: "Informatie over herroepingsrecht",
    intro: "NeXify AI biedt diensten uitsluitend aan in het zakelijke verkeer (B2B).",
    updated: "Juni 2026",
    sections: [
      {
        heading: "Geen consumentenovereenkomst",
        paragraphs: [
          "Overeenkomsten worden uitsluitend gesloten met ondernemers, rechtspersonen en vergelijkbare organisaties die handelen in de uitoefening van hun bedrijf of zelfstandig beroep. Het wettelijke herroepingsrecht voor consumenten bij overeenkomsten op afstand is daarom in principe niet van toepassing.",
          "Met aanvraag en opdrachtverlening bevestigt de opdrachtgever als ondernemer in de zin van het toepasselijke recht te handelen.",
        ],
      },
      {
        heading: "Uitzonderingsgevallen",
        paragraphs: [
          "Mocht in een uitzonderingsgeval een persoon in strijd met deze oriëntatie als consument willen handelen, dan moet dit vóór contractsluiting uitdrukkelijk worden gemeld en afzonderlijk worden overeengekomen. In dat geval worden de wettelijke informatieplichten en herroepingsinstructies individueel verstrekt – of wordt de contractsluiting geweigerd.",
        ],
      },
      {
        heading: "Coulance bij projectannulering",
        paragraphs: [
          "Ongeacht het ontbrekende wettelijke herroepingsrecht geldt: vóór aanvang van de uitvoering kan een verstrekte opdracht schriftelijk kosteloos worden geannuleerd, mits nog geen diensten zijn geleverd. Reeds geleverde concept- of uitvoeringsdiensten worden naar rato van het dagtarief gefactureerd.",
        ],
      },
    ],
  },
};

// Legacy alias for the flat (non-locale-prefixed) app/* route tree via
// components/legal-page.tsx. See NOTE above.
export const legalNl = legalPagesNl;
