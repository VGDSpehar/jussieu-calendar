const axios = require('axios');
const xml2js = require('xml2js');

async function fetchExportLinks(baseUrls) {
  const parser = new xml2js.Parser();
  const exportLinks = [];

  for (let baseUrl of baseUrls) {
    try {
      const response = await axios({
        method: 'PROPFIND',
        url: baseUrl,
        headers: {
          'Content-Type': 'application/xml',
          Depth: 1,
        },
        auth: {
          username: 'student.master',
          password: 'guest',
        },
      });

      parser.parseString(response.data, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
          return;
        }

        const responses = result['multistatus']['response'] || [];
        responses.forEach((response) => {
          const href = response['href'][0];
          if (href.match(/\/M\d?_.+\//)) {
            exportLinks.push(baseUrl + href);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching:', error);
    }
  }
  return exportLinks;
}

const baseUrls = [
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/MasterInfo/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/ANDROIDE/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/BIM/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/DAC/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/IMA/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/IQ/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/RES/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/SAR/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/SESI/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/SFPN/',
  'https://cal.ufr-info-p6.jussieu.fr:443/caldav.php/STL/'
];

fetchExportLinks(baseUrls).then((exportLinks) => {
  console.log('Export Links:', exportLinks);
});
