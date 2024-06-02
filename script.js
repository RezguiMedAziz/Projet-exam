
////////////////////////////////// CLASSES !!!!! ///////////////////////////////////////////////// 

class Side {
    constructor(color, initialResources) {
        this.color = color;
        this.resources = initialResources;
        this.warriors = []; // Separate array for each side's warriors
    }
 

    getCurrentWarrior(index) {
        return this.warriors[index];
    }

    addWarrior(warrior) {
        this.warriors.push(warrior);
    }
}


class Warrior {
    constructor(type, hp, baseForce, resources, position) {
        this.type = type;
        this.hp = hp;
        this.resources = resources;
        this.position = position;

        // Adjust force based on warrior type
        if (this.type === 'Elf') {
            this.force = 20; // Elf has a base force of 20
        } else if (this.type === 'Chef Elf') {
            this.force = 40; // Chef Elf has a force of 40
        } else {
            this.force = baseForce; // Base force for others (including Nan and Guerrier)
        }

        this.damage = this.calculateDamage(); // Calculate damage upon instantiation
    }

    calculateDamage() {
        let totalDamage = 0;
        let diceRolls = this.force; // Number of dice rolls is equal to the force of the warrior
        for (let i = 0; i < diceRolls; i++) {
            totalDamage += Math.floor(Math.random() * 3) + 1; // Roll a 3-sided die
        }

        // Adjust damage based on warrior type
        if (this.type === 'Nan') {
            totalDamage = Math.floor(totalDamage / 2); // Nan takes half damage
        } else if (this.type === 'Chef Nan') {
            totalDamage = Math.floor(totalDamage / 4); // Chef Nan takes quarter damage
        }

        return totalDamage;
    }
}

/////////////////////////////// Create warrior instances/////////////////////////////////////////// 

const elf = new Warrior('Elf', 100, 10, 2, 0); // Elf's force will be 20
const ChefElf = new Warrior('Chef Elf', 100, 10, 4, 0); // Chef Elf's force will be 40
const nan = new Warrior('Nan', 100, 10, 1, 0); // Nan's damage will be halved
const ChefNan = new Warrior('Chef Nan', 100, 10, 3, 0); // Chef Nan's damage will be quartered



class Game {
    constructor() {
        // Initialize resources for each side using generateResources function
        const resources = generateResources();
        this.redSide = new Side("red", resources.red);
        this.blueSide = new Side("blue", resources.blue);
    }

    getSide(sideColor) {
        return sideColor === "red" ? this.redSide : this.blueSide;
    }
}

////////////////////////////////////////////////////////////////////////////// FUNCTIONS !!!!!!!!!! //////////////////////////////////////////////////////////



  

function handleImageGallery(sideColor, currentIndex, updateCurrentIndex) {
    // Array of image URLs
    var images = [
        { src: 'Pics/Ziggs_0.jpg', name: 'Elf', warrior: elf },
        { src: 'Pics/heimer.jpg', name: 'Chef Elf', warrior: ChefElf },
        { src: 'Pics/mundo.jpg', name: 'Nan', warrior: nan },
        { src: 'Pics/Urgot_0.jpg', name: 'Chef Nan', warrior: ChefNan }
    ];

    // Get references to HTML elements
    var imageElement = document.getElementById('image');
    var nameElement = document.getElementById('imageName');
    var nextButton = document.getElementById('nextButton');
    var prevButton = document.getElementById('prevButton');

    // Function to update the image and name
    function updateImage() {
        var currentImage = images[currentIndex];
        // Access resources from the warrior object
        var resources = currentImage.warrior.resources;
        // Concatenate the name and resources with a line break
        var nameWithResources = `${currentImage.name} <br> Needs ${resources} Resources`;
        // Set the name content with the line break
        imageElement.src = currentImage.src;
        // Set the name content with the line break
        nameElement.innerHTML = nameWithResources;
        console.clear(); // Clear the console
        console.log("Current index:", currentIndex); // Logging current index for debugging
    }
    

    // Initialize the gallery with the current index
    updateImage();

    // Add event listener for the next button
    nextButton.addEventListener('click', function () {
        // Increment the index, looping back to 0 if necessary
        currentIndex = (currentIndex + 1) % images.length;
        // Update the image and name
        updateImage();
        // Update currentIndex via callback
        updateCurrentIndex(currentIndex);
    });

    // Add event listener for the previous button
    prevButton.addEventListener('click', function () {
        // Decrement the index, looping back to the last index if necessary
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        // Update the image and name
        updateImage();
        // Update currentIndex via callback
        updateCurrentIndex(currentIndex);
    });

    // Return the selected warrior
    return function () {
        return images[currentIndex].warrior;
    };
}


////////////////////////////// Define resources globally/////////////////////////////////////

var resources = generateResources();

function generateResources() {
    var redResources = 3;
    var blueResources = 3;

    return {
        red: redResources,
        blue: blueResources
    };
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function updateResources(side, resources) {
    if (side === 'blue') {
        resources.blue += 1;
        console.log("Blue resources incremented:", resources.blue);
    } else if (side === 'red') {
        resources.red += 1;
        console.log("Red resources incremented:", resources.red);
    }
}



var tourStarted = false;

function handleSelectDiv() {
    var startBtn = document.getElementById('startBtn');
    var trainBtn = document.getElementById('trainBtn'); // Add reference to the "Train" button
    var clickedStart = false; // Flag to track if the Start button is clicked
    var clickedSide = false; // Flag to track if a side is clicked
    var message1 = document.getElementById('message1');

    var message2 = document.getElementById('message2');
    var message3 = document.getElementById('message3');

    var message6 = document.getElementById('message6');

    var sideColor = "";
    var resources = generateResources(); // Initialize resources
    var currentIndex = 0; // Initialize currentIndex here
    function handleClick(event) {
        if (tourStarted) {
            event.stopPropagation(); // Prevent event propagation
            event.preventDefault(); // Prevent default action
        } else {
            var screenWidth = window.innerWidth;
            var clickX = event.clientX;
            var selectDiv = document.getElementById('selectDiv'); // Assuming the selectDiv ID is selectDiv
        
            if (event.target === startBtn) {
                clickedStart = true; // Set flag to true when Start button is clicked
            } else if (clickX <= screenWidth / 4 || clickX >= (screenWidth * 3) / 4) {
                if (clickedStart) {
                    // Determine the side color based on where the user clicks
                    sideColor = clickX <= screenWidth / 4 ? 'blue' : 'red'; 
                    clickedSide = true; // Set flag to true when clicking within smaller regions on the left or right, but only if Start button is clicked
                } else {
                    console.log("Please click the Start button first.");
                }
            }
            if (clickedStart && clickedSide) {
                var selectedWarrior = handleImageGallery(sideColor, currentIndex, updateCurrentIndex)(); // Call the returned function to get the selected warrior
                selectDiv.querySelector('h4').textContent = `${sideColor} Side You Have ${resources[sideColor]} Resources`;
        
                selectDiv.style.display = 'block'; // Display the select div
        
                // Hide the message when the select div is displayed
                message2.style.display = 'none';
        
                message1.style.display = 'none';
    
                message3.style.display = 'none';

                message6.style.display = 'none';

    
    
                // Remove previous event listeners before adding a new one
                trainBtn.removeEventListener('click', trainButtonClickHandler);
        
                // Attach event listener to the train button
                trainBtn.addEventListener('click', trainButtonClickHandler);
            }
        
            // Hide selectDiv and remove blur effect if clicked outside of the specified areas
            if (!clickedSide && !selectDiv.contains(event.target) && event.target !== startBtn) {
                selectDiv.style.display = 'none';
        
                // Check if both sides have at least one warrior trained
                var redWarriors = game.getSide("red").warriors;
                var blueWarriors = game.getSide("blue").warriors;
        
                if (redWarriors.length === 0 || blueWarriors.length === 0) {
                    // Display message 2 if at least one side has no warriors trained
                    message2.style.display = 'block';
                    message3.style.display = 'none'; // Ensure message 3 is hidden
                } else {
                    // Display message 3 if both sides have at least one warrior trained
                    message2.style.display = 'none'; // Ensure message 2 is hidden
                    message3.style.display = 'block'; // Show message 3
                }
                          
            } else {
                clickedSide = false; // Reset clickedSide flag when clicking outside the specified areas
            }
        }
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    
    // Function to start the tour
    function startTour() {
        tourStarted = true; // Set tourStarted flag to true
        var message3 = document.getElementById('message3');
        var message4 = document.getElementById('message4');
    
        message3.style = '';
        message3.style.display = 'none';
    
        message4.style.display = 'block';
    
        // Delay the movement of warriors by 2 seconds after displaying the message
        setTimeout(moveWarriors, 2000); // Delay of 2000 milliseconds (2 seconds)
    }


// Add event listener to the "Yes" button
var yesButton = document.getElementById('yes');
yesButton.addEventListener('click', startTour);

// Add event listener for click events on the document
document.addEventListener('click', handleClick);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function moveWarriors() {
    var blueWarriors = game.getSide("blue").warriors;
    var redWarriors = game.getSide("red").warriors;
    var gridCells = document.getElementById('grid').rows[0].cells;

    // Check if any blue warrior's position matches any red warrior's position initially
    var initialMeeting = blueWarriors.some(blueWarrior => {
        return redWarriors.some(redWarrior => {
            return blueWarrior.position === redWarrior.position;
        });
    });

    // If meeting occurs initially, start the fight immediately
    if (initialMeeting) {
        document.getElementById('message4').style.display = 'none';
        document.getElementById('message5').style.display = 'block';
        startFight(blueWarriors, redWarriors, sideColor, resources);
        return; // Exit the function
    }

    // Move warriors until they meet
    var moveInterval = setInterval(function() {
        var blueMoved = false;
        var redMoved = false;

        // Move blue warriors
        for (var blueIndex = 0; blueIndex < blueWarriors.length; blueIndex++) {
            if (moveWarrior(blueWarriors[blueIndex], gridCells, 'blue')) {
                blueMoved = true;
                updateResources('blue', resources); // Update resources for blue side
            }
        }

        // Check if any blue warrior's position matches any red warrior's position
        var meeting = blueWarriors.some(blueWarrior => {
            return redWarriors.some(redWarrior => {
                return blueWarrior.position === redWarrior.position;
            });
        });

        // If meeting occurs, stop the interval
        if (meeting) {
            clearInterval(moveInterval);
            document.getElementById('message4').style.display = 'none';
            document.getElementById('message5').style.display = 'block';
            startFight(blueWarriors, redWarriors, sideColor, resources);
            return; // Exit the function
        }

        // Move red warriors after a delay
        setTimeout(function() {
            for (var redIndex = 0; redIndex < redWarriors.length; redIndex++) {
                if (moveWarrior(redWarriors[redIndex], gridCells, 'red')) {
                    redMoved = true;
                    updateResources('red', resources); // Update resources for red side
                }
            }

            // Check if any red warrior's position matches any blue warrior's position
            meeting = redWarriors.some(redWarrior => {
                return blueWarriors.some(blueWarrior => {
                    return redWarrior.position === blueWarrior.position;
                });
            });

            // If meeting occurs, stop the interval
            if (meeting) {
                clearInterval(moveInterval);
                document.getElementById('message4').style.display = 'none';
                document.getElementById('message5').style.display = 'block';
                startFight(blueWarriors, redWarriors, sideColor, resources);
            }
        }, 1000); // Delay for red warriors
    }, 2000); // Set the delay between each movement
}

function moveWarrior(warrior, gridCells, side) {
    console.log('Warrior:', warrior); // Log the warrior object
    var currentGridId = warrior.position;
    var targetGridId;

    // Determine the target grid ID based on the side
    if (side === 'blue') {
        targetGridId = parseInt(currentGridId) + 1;
    } else {
        targetGridId = parseInt(currentGridId) - 1;
    }

    // Move warrior's image to the next or previous grid cell if it exists
    var currentImage = document.getElementById(currentGridId).querySelector('img');
    var targetGridCell = document.getElementById(targetGridId);

    if (currentImage && targetGridCell) {
        // Clone the image element
        var clonedImage = currentImage.cloneNode(true);

        // Remove the original image from the current cell
        currentImage.remove();

        // Append the cloned image to the target grid cell
        targetGridCell.appendChild(clonedImage);

        // Update warrior's position
        warrior.position = targetGridId.toString();
        console.log(`${side.charAt(0).toUpperCase() + side.slice(1)} Warrior ${warrior.type} moved to position ${warrior.position}`);
        return true;
    } else {
        console.log(`${side.charAt(0).toUpperCase() + side.slice(1)} Warrior reached the end of the grid.`);
        return false;
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




function destroyWarrior(warrior, side) {
    // Check if the warrior has an associated image element
    if (warrior.imageElement) {
        var imageElement = document.getElementById(warrior.imageElement.id);
        if (imageElement) {
            // Add animation class to trigger CSS animation
            imageElement.classList.add('fade-out');
            
            // Set timeout to remove the image element after the animation
            setTimeout(() => {
                imageElement.remove();
                // Remove the warrior from the array
                side.warriors = side.warriors.filter(w => w !== warrior);
            }, 4000); // Adjust the timeout duration to match the CSS animation duration
        } else {
            console.error("Warrior's image element is not found in the DOM.");
        }
    } else {
        console.error("Warrior's image element is null.");
    }
}



function startFight(blueWarriors, redWarriors, sideColor, resources) {
    let fightOngoing = true;
    let blueInPosition = [];
    let redInPosition = [];

    while (fightOngoing) {
        fightOngoing = false;

        // Get the unique positions where fights might occur
        const positions = [...new Set(blueWarriors.map(w => w.position).concat(redWarriors.map(w => w.position)))];

        for (const position of positions) {
            blueInPosition = blueWarriors.filter(w => w.position === position);
            redInPosition = redWarriors.filter(w => w.position === position);

            if (blueInPosition.length > 0 && redInPosition.length > 0) {
                fightOngoing = true;

                // Blue side attacks first
                for (const blueWarrior of blueInPosition) {
                    let damageToDeal = blueWarrior.damage;

                    while (damageToDeal > 0 && redInPosition.length > 0) {
                        let targetWarrior = redInPosition[0];
                        targetWarrior.hp -= damageToDeal;

                        console.log(`Blue ${blueWarrior.type} Warrior attacked Red ${targetWarrior.type} Warrior for ${damageToDeal} damage.`);
                        console.log(`Red ${targetWarrior.type} Warrior's HP: ${targetWarrior.hp}`);
                        updateBorderColor(blueWarrior);
                        updateBorderColor(targetWarrior);
                        
                        if (targetWarrior.hp <= 0) {
                            console.log(`Red ${targetWarrior.type} Warrior defeated!`);
                            destroyWarrior(targetWarrior, game.getSide(sideColor));
                            redWarriors = redWarriors.filter(w => w.hp > 0); // Ensure defeated warrior is removed
                            redInPosition.shift();
                            damageToDeal = -targetWarrior.hp; // Carry over remaining damage
                        } else {
                            damageToDeal = 0; // All damage dealt
                        }
                    }
                }

                // Red side attacks next
                for (const redWarrior of redInPosition) {
                    let damageToDeal = redWarrior.damage;

                    while (damageToDeal > 0 && blueInPosition.length > 0) {
                        let targetWarrior = blueInPosition[0];
                        targetWarrior.hp -= damageToDeal;

                        console.log(`Red ${redWarrior.type} Warrior attacked Blue ${targetWarrior.type} Warrior for ${damageToDeal} damage.`);
                        console.log(`Blue ${targetWarrior.type} Warrior's HP: ${targetWarrior.hp}`);
                        updateBorderColor(redWarrior);
                        updateBorderColor(targetWarrior);

                        if (targetWarrior.hp <= 0) {
                            console.log(`Blue ${targetWarrior.type} Warrior defeated!`);
                            destroyWarrior(targetWarrior, game.getSide(sideColor));
                            blueWarriors = blueWarriors.filter(w => w.hp > 0); // Ensure defeated warrior is removed
                            blueInPosition.shift();
                            damageToDeal = -targetWarrior.hp; // Carry over remaining damage
                        } else {
                            damageToDeal = 0; // All damage dealt
                        }
                    }
                }

         
                // Check winner after each fight
                if (redInPosition.length === 0) {
                    // Red side has no warriors left
                    setTimeout(function() {
                        console.log("All red Warriors defeated. blue side wins!");
                        showEndMessage("blue");
                        moveWarriorsToNextGrid("blue");
                        updateResources("blue",resources);
                        tourStarted = false;
                        
                 

                        // Check if a blue warrior reached grid 5 and no red warriors are left
                        if (blueWarriors.some(w => w.position === "5") && redWarriors.length === 0) {
                            console.log("Blue warrior reached grid 5 and red side has no warriors left.");
                            endGame('blue');
                            return;
                        }
                    }, 5000);
                    return;
                } else if (blueInPosition.length === 0) {
                    // Blue side has no warriors left
                    setTimeout(function() {
                        console.log("All blue Warriors defeated. red side wins!");
                        showEndMessage("red");
                        moveWarriorsToNextGrid("red");
                        updateResources("red",resources);
                        

                        tourStarted = false;
                        
                        // Check if a red warrior reached grid 1 and no blue warriors are left
                        if (redWarriors.some(w => w.position === "1") && blueWarriors.length === 0) {
                            console.log("Red warrior reached grid 1 and blue side has no warriors left.");
                            endGame('red');
                            return;
                        }
                    }, 5000);
                    return;
                }
            }
        }
    }

    // Log the lists of warriors for both sides after the fight is over
    console.log("Blue side warriors:");
    console.log(blueWarriors);
    console.log("Red side warriors:");
    console.log(redWarriors);

    // If both sides have warriors left, it's a draw
    
        tourStarted = false; 
    


}






function endGame(winningSide) {
    // Hide the grid table and previous message
    document.getElementById('grid').style.display = 'none';
    document.getElementById('message6').style.display = 'none';

    // Create a new image element
    var victoryImage = new Image();

    // Determine which victory image to display based on the winning side
    if (winningSide === 'red') {
        victoryImage.src = "Pics/victoryred.png"; // Path to the victory red image
    } else if (winningSide === 'blue') {
        victoryImage.src = "Pics/victoryblue.png"; // Path to the victory blue image
    } else {
        // Handle invalid winning side
        console.error("Invalid winning side:", winningSide);
        return;
    }

    // Append the image to a container in your HTML
    var imageContainer = document.getElementById("message7");
    imageContainer.appendChild(victoryImage);

    // Apply CSS classes to center the image and make it bigger
    imageContainer.classList.add('center');
    victoryImage.classList.add('victory-image');

    // Show the victory sound
    var victorySound = document.getElementById("victorysound");
    victorySound.play();

    // Set the tourStarted flag to true
    tourStarted = true;

    // Additional log to confirm the end of function execution
    console.log("Game ended");
}






// Function to show the end message
function showEndMessage(winner) {
    document.getElementById("message5").style.display = "none";
    var message6 = document.getElementById("message6");
    message6.style.display = "block";
    message6.querySelector("h3").textContent = `${winner} side wins! You can train your warriors again.`;
}






function moveWarriorsToNextGrid(side) {
    const warriors = game.getSide(side).warriors;
    const gridCells = document.getElementById('grid').rows[0].cells;

    for (const warrior of warriors) {
        const currentGridId = warrior.position;
        let targetGridId;

        // Determine the target grid ID based on the side
        if (side === 'blue') {
            targetGridId = parseInt(currentGridId) + 1;
        } else {
            targetGridId = parseInt(currentGridId) - 1;
        }

        // Move warrior's image to the next grid cell if it exists
        const currentImage = document.getElementById(currentGridId).querySelector('img');
        const targetGridCell = document.getElementById(targetGridId);

        if (currentImage && targetGridCell) {
            // Clone the image element
            const clonedImage = currentImage.cloneNode(true);

            // Remove the original image from the current cell
            currentImage.remove();

            // Append the cloned image to the target grid cell
            targetGridCell.appendChild(clonedImage);

            // Update warrior's position
            warrior.position = targetGridId.toString();
            console.log(`${side.charAt(0).toUpperCase() + side.slice(1)} Warrior ${warrior.type} moved to position ${warrior.position}`);
        } else {
            console.log(`${side.charAt(0).toUpperCase() + side.slice(1)} Warrior reached the end of the grid.`);
        }
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function trainButtonClickHandler() {
    var selectedWarrior = handleImageGallery(sideColor, currentIndex, updateCurrentIndex)(); // Get the selected warrior
    var images = [
        { src: 'Pics/elf.png', name: 'Elf', warrior: elf },
        { src: 'Pics/chef elf.png', name: 'Chef Elf', warrior: ChefElf },
        { src: 'Pics/nan.png', name: 'Nan', warrior: nan },
        { src: 'Pics/chef nan.png', name: 'Chef Nan', warrior: ChefNan }
    ];

    var side = game.getSide(sideColor);

    // Function to remove defeated warriors
    function removeDefeatedWarriors() {
        side.warriors = side.warriors.filter(warrior => warrior.hp > 0);
    }


    // Remove defeated warriors before training a new one
    removeDefeatedWarriors();

    if (selectedWarrior.resources <= resources[sideColor]) {
        if (resources[sideColor] >= selectedWarrior.resources) {
            // Deduct resources used for training
            resources[sideColor] -= selectedWarrior.resources;

            var newWarrior = new Warrior(
                selectedWarrior.type,
                selectedWarrior.hp,
                selectedWarrior.force,
                selectedWarrior.resources,
                selectedWarrior.position
            );

            var imageObject = images.find(image => image.name === newWarrior.type);
            if (imageObject) {
                var warriorImageElement = document.createElement('img');
                warriorImageElement.src = imageObject.src;
                warriorImageElement.style.width = "70px"; // Adjust the width as needed
                warriorImageElement.style.height = "70px"; // Adjust the height as needed
                warriorImageElement.style.borderRadius = "50%"; // Make it circular
                warriorImageElement.style.marginRight = "10px"; // Adjust margin as needed
                warriorImageElement.style.backgroundColor = `rgba(${sideColor === "red" ? "255, 0, 0" : "0, 0, 255"}, 0.3)`; // Apply blurry background
                warriorImageElement.style.borderWidth = "5px"; // Set border width
                warriorImageElement.style.boxShadow = "";

                warriorImageElement.id = `${sideColor}-warrior-${Date.now()}`; // Use timestamp for unique ID
                newWarrior.imageElement = warriorImageElement;
            }

            side.addWarrior(newWarrior);

            selectDiv.querySelector('h4').textContent = `${sideColor} Side You Have ${resources[sideColor]} Resources`;

            var gridCellId = sideColor === "red" ? "5" : "1"; // red side trains at "5" and blue side at "1"
            newWarrior.position = gridCellId;

            var gridCell = document.getElementById(gridCellId);

            var imageContainer = gridCell.querySelector('.image-container');
            if (!imageContainer) {
                imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                imageContainer.style.display = "flex";
                gridCell.appendChild(imageContainer);
            }

            imageContainer.appendChild(newWarrior.imageElement);
            updateBorderColor(newWarrior);


            // Log a message indicating the warrior has been trained for the side
            console.log(`${newWarrior.type} has been trained for ${sideColor} side.`);
            console.log(`Updated resources after training. Red: ${resources.red}, Blue: ${resources.blue}`);
            console.log(resources);

            // Log the list of warriors for the current side
            console.log(`${sideColor} side warriors:`);
            side.warriors.forEach(warrior => {
                console.log(warrior);
            });

            // Remove defeated warriors after training a new one
            removeDefeatedWarriors(); 
            

        } else {
            console.log("Insufficient Resources To Train Warrior.");
        }
    } else {
        console.log("Insufficient Resources To Train Warrior.");
    }
}




// Function to update border color based on current HP with blurry effect
function updateBorderColor(warrior) {
    // Ensure warriors is an array, even if it contains only one element
    if (!Array.isArray(warrior)) {
        warrior = [warrior];
    }

    // Iterate over each warrior and update the border color based on current HP
    warrior.forEach(war => {
        // Get the image element of the warrior
        var warriorImageElement = document.getElementById(war.imageElement.id);

        // Check if warriorImageElement exists before attempting to update its style
        if (warriorImageElement) {
            // Check current HP and update border color with blurry effect accordingly
            const currentHP = war.hp;

            if (currentHP > 70) {
                warriorImageElement.style.boxShadow = "0 0 10px 10px rgba(0, 255, 0, 0.5)"; // Blurry green
            } else if (currentHP > 30) {
                warriorImageElement.style.boxShadow = "0 0 10px 10px rgba(255, 255, 0, 0.5)"; // Blurry yellow
            } else {
                warriorImageElement.style.boxShadow = "0 0 10px 10px rgba(255, 0, 0, 0.5)"; // Blurry red
            }
        } else {
            console.warn(`Warrior of type ${war.type} does not have an imageElement property.`);
        }
    });
}











// Refresh image gallery to display the next set of warriors   
document.addEventListener('click', function(event) {
    handleClick(event, game, resources);
});

// Update currentIndex when the user navigates through the gallery
function updateCurrentIndex(index) {
    currentIndex = index;
}

// Initialize the gallery with the updated currentIndex
handleImageGallery(sideColor, currentIndex, updateCurrentIndex);
} 







function startBattle() {
    var welcome = document.querySelector(".welcome");
    var messages = document.querySelectorAll(".message");
    var grid = document.getElementById("grid");
    var cells = grid.querySelectorAll("td");
    var delay = 300; // Adjust delay between cells

    // Play the start sound
    var startSound = document.getElementById("startSound");
    var backgroundSound = document.getElementById("backgroundSound");

    startSound.play();
    backgroundSound.play();

    // Remove the welcome text and button from the DOM
    welcome.parentNode.removeChild(welcome);

    // Show the grid with animation
    grid.style.display = "table";

    // Loop through each cell and apply animation
    cells.forEach(function (cell, index) {
        setTimeout(function () {
            cell.style.opacity = "1"; // Set opacity to 1 to show the cell
        }, index * delay); // Apply delay to each cell
    });

    // Show the first message with animation
    messages[0].style.opacity = "1";
    messages[0].style.transition = "opacity 0.5s ease"; // Add animation for appearing

    // Hide the first message after 3 seconds with animation
    setTimeout(function () {
        messages[0].style.opacity = "0";
    }, 3000); // Hide after 3 seconds

    // Show the second message after the first one disappears
    setTimeout(function () {
        messages[1].style.opacity = "1";
        messages[1].style.transition = "opacity 0.5s ease"; // Add animation for appearing
    }, 3000); // Show after 5.5 seconds (2 seconds for the first message to appear + 3 seconds to disappear)
}


// Initialization
document.addEventListener('DOMContentLoaded', function () {
    var selectDiv = document.querySelector('.select');
    selectDiv.style.display = 'none'; // Hide the select div initially

    handleSelectDiv();
});



// Initial resources
const game = new Game();
console.log("Initial resources:", game.redSide.resources, game.blueSide.resources);





