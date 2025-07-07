function generateCrewHTML(txtContent, imageFileNames) {
  const crewContainer = document.querySelector('.crew-collection');

  // 1. Parse the txt into objects
  const lines = txtContent.trim().split(/\r?\n/);
  const crewData = [];

  for (let i = 0; i < lines.length; i += 2) {
    const nameLine = lines[i];
    const positionLine = lines[i + 1];

    const nameMatch = nameLine.match(/name:\s*(.+)/i);
    const posMatch = positionLine.match(/position:\s*(.+)/i);

    if (nameMatch && posMatch) {
      crewData.push({
        name: nameMatch[1].trim(),
        position: posMatch[1].trim()
      });
    }
  }

  // 2. Match images to people
  crewData.forEach(person => {
    const searchTerms = (person.name + ' ' + person.position).toLowerCase().split(/\s+/);

    let matchedImage = imageFileNames.find(filename => {
      const lowerFilename = filename.toLowerCase();
      return searchTerms.some(term => lowerFilename.includes(term));
    });

    if (!matchedImage) matchedImage = 'placeholder.jpg'; // fallback

    // 3. Create HTML structure
    const memberDiv = document.createElement('div');
    memberDiv.classList.add('crew-member');

    const imageDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = `./${matchedImage}`;
    img.alt = person.name;
    imageDiv.appendChild(img);

    const nameP = document.createElement('p');
    nameP.textContent = person.name;

    const positionP = document.createElement('p');
    positionP.textContent = person.position;

    memberDiv.appendChild(imageDiv);
    memberDiv.appendChild(nameP);
    memberDiv.appendChild(positionP);

    crewContainer.appendChild(memberDiv);
  });
}