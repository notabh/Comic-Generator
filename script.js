let currentPanel = 1;
//let generatedImages = [];

async function generateNextPanel() {
    const panelText = document.getElementById('panel').value;
    if (panelText.trim() === '') {
        alert('Please enter text for the current panel.');
        return;
    }

    const panels = Array(currentPanel).fill(''); // Initialize an array with empty strings
    panels[currentPanel - 1] = panelText;

    try {
        const imageBlob = await query({ "inputs": panels.join('\n') });
        //storeGeneratedImage(imageBlob);
        displayComic(imageBlob);
    } catch (error) {
        console.error('Error generating comic:', error);
        alert('Error generating comic. Please try again.');
    }

    currentPanel++;

    if (currentPanel > 10) {
        // All panels generated, reset for next use
        currentPanel = 1;
        document.getElementById('comicForm').reset();
    } else {
        document.getElementById('panel').value = ''; // Clear the text area for the next panel
        document.getElementById('panel').focus(); // Focus on the text area for better user experience
    }
}

function storeGeneratedImage(imageBlob) {
    generatedImages[currentPanel - 1] = URL.createObjectURL(imageBlob);
}

async function query(data) {
    const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
            headers: {
                "Accept": "image/png",
                "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.blob();
}

function displayComic(imageBlob) {
    const comicDisplay = document.getElementById('comicDisplay');
    comicDisplay.innerHTML = '';

    // for (let i = 0; i < generatedImages.length; i++) {
    //     const img = document.createElement('img');
    //     img.src = generatedImages[i];
    //     img.alt = `Generated Comic - Panel ${i + 1}`;
    //     comicDisplay.appendChild(img);
    // }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(imageBlob);
    img.alt = `Generated Comic - Panel ${currentPanel}`;
    comicDisplay.appendChild(img);

    comicDisplay.classList.remove('hidden');
}
