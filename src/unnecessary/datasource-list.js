export default [
    /*{
        title: "Datatank",
        url: "http://ewi.mmlab.be/otn/api/info",
        type: "datatank"
    },
    {
        title: "Datasets",
        url: "http://otn-dev.intrasoft-intl.com/otnServices-1.0/platform/ckanservices/datasets",
        language: 'eng',
        type: "ckan",
        download: true
    }, */
    {
        title: "Layman",
        url: `${window.location.protocol}//${window.location.hostname}/layman`,
        user: 'browser',
        type: "layman"
    },
    {
        title: "OTN Hub",
        url: "http://opentnet.eu/php/metadata/csw/",
        language: 'eng',
        type: "micka",
        code_list_url: 'http://opentnet.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
    }, 
    {
        title: "SuperCAT",
        url: "http://cat.ccss.cz/csw/",
        language: 'eng',
        type: "micka",
        code_list_url: 'http://www.whatstheplan.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
    }
]