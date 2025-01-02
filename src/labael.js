import * as THREE from 'three'
function createTextSquare(title, description) {
    const squareCanvas = document.createElement('canvas');
    const squareContext = squareCanvas.getContext('2d');


    const scale = 3;  
    squareCanvas.width = 1024 * scale;  
    squareCanvas.height = 1792 * scale;

    squareContext.scale(scale, scale);


    squareContext.fillStyle = 'white';
    squareContext.fillRect(0, 0, squareCanvas.width / scale, squareCanvas.height / scale);

    squareContext.fillStyle = 'black';
    squareContext.font = `bold ${120}px Arial`;
    squareContext.textAlign = 'left';
    squareContext.textBaseline = 'top';
    squareContext.imageSmoothingEnabled = true;
    squareContext.imageSmoothingQuality = 'low';

    squareContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
    squareContext.shadowBlur = 5;  
    squareContext.fillText(title, 40, 40); 


    squareContext.font = `${90}px Arial`;
    squareContext.fillStyle = 'black';
    squareContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
    squareContext.shadowBlur = 5;  
    wrapText(squareContext, description, 40, 160, (squareCanvas.width / scale) - 80, 70);

    const squareGeometry = new THREE.PlaneGeometry(8, 14);
    const squareTexture = new THREE.CanvasTexture(squareCanvas);
    squareTexture.minFilter = THREE.LinearFilter; 
    squareTexture.magFilter = THREE.LinearFilter;  
    squareTexture.needsUpdate = true;

    const squareMaterial = new THREE.MeshBasicMaterial({ 
        map: squareTexture,
        side: THREE.DoubleSide,
        transparent: false
    });

    const square = new THREE.Mesh(squareGeometry, squareMaterial);
    square.material.depthTest = false;
    square.material.depthWrite = false;
    square.renderOrder = 2;
    square.visible = false;

    return square;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let posY = y;

    for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
            context.fillText(line, x, posY);
            line = word + ' ';
            posY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, posY);
}


export function createLabel(text, title, description, descriptionPositon) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const radius = 40; 
    canvas.width = radius * 2;  
    canvas.height = radius * 2;

    context.beginPath();
    context.arc(radius, radius, radius - 2, 0, 2 * Math.PI); 
    context.clip(); 

    context.beginPath();
    context.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 8;        
    context.stroke();             

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.beginPath();
    context.arc(radius, radius, radius - 2, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = 'white';
    context.font = '36px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, radius, radius);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter; 
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.material.depthTest = false;
    sprite.renderOrder = 1;

    const square = createTextSquare(title, description);
    square.position.set(descriptionPositon.x, descriptionPositon.y, descriptionPositon.z);
    square.rotation.set(
        descriptionPositon.rotation.x,
        descriptionPositon.rotation.y,
        descriptionPositon.rotation.z
    );
    
    sprite.add(square);

    return sprite;
}


export const InitLabels = [
    {
        x: 1.4732206788158488,
        y: 4.6081551620034045,
        z: 2.4093459592278412,
        cameraPosition: {
            x: 4.72,
            y: 6.05,
            z: 2.16
        },
        descriptionPositon:{
            x: -4.8,
            y: -1,
            z: 0,
            rotation: {
                x:  0,
                y: -0.1,
                z: -0.24
            }
        },
        description: "The watch case is made from gold-plated stainless steel, measuring approximately 43 mm in diameter. It has a distinctive knurled bezel with 120 precision-cut grooves, enhancing both its elegant look and exceptional durability against mechanical damage.",
        title: "Case"
    },
    {
        x: 0.6497142614848816,
        y: 4.855132754519085,
        z: -2.4763185376751817,
        cameraPosition: {
            x: 6.41,
            y: 4.24,
            z: -0.06
        },
        descriptionPositon:{
            x: 4.8,
            y: -3,
            z: 0,
            rotation: {
                x: 0,
                y: .14,
                z: 0
            }
        },
        description: "The strap is made of high-quality navy-blue rubber with a textured surface for improved ventilation. It features a fold-over butterfly clasp made of stainless steel with quick length adjustment, ensuring comfort and secure usage, including a safety lock.",
        title: "Strap"
    },
    {
        x: 1.2652953426787708,
        y: 3.807800992397582,
        z: 2.932147920550089,
        cameraPosition: {
            x: 4.05,
            y: 4.25,
            z: 4.9
        },
        descriptionPositon:{
            x: -4.8,
            y: -1,
            z: 0,
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        description: "The sapphire crystal, 2 mm thick, is one of the hardest materials in watchmaking (9 on the Mohs scale). It features a multi-layer anti-reflective coating on both sides, ensuring excellent readability, and is highly scratch-resistant, offering long-lasting protection.",
        title: "Sapphire Crystal"
    },
    {
        x: -0.44240203938218403,
        y: 4.081122732199145,
        z: 2.619998222864781,
        cameraPosition: {
            x: -0.29,
            y: 4.63,
            z: 6.35
        },
        descriptionPositon:{
            x: -4.8,
            y: -1,
            z: 0,
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        description: "The dial features a cobalt-blue color with gold-plated Roman numeral indices. It includes two sub-dials: a power reserve indicator at 6 o’clock and a small seconds sub-dial at 12 o’clock. The hands are coated with Super-LumiNova for visibility in the dark.",
        title: "Dial"
    },
    {
        x: -0.07859311771003163,
        y: 3.646336675346114,
        z: 1.771054015718179,
            cameraPosition: {
            x: -0.09,
            y: 3.55,
            z: -1.89
        },
        descriptionPositon:{
            x: -4.8,
            y: -1,
            z: 0,
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        description: "The transparent sapphire case back reveals the automatic UN-32 movement, secured by six gold-plated stainless steel screws. The brand name ULYSSE NARDIN' and the serial number are engraved on the edge, while the rotor and movement components are visible.",
        title: "Case Back"
    }
];




// window.addEventListener('click', (event) => {
//     // Przekształcenie współrzędnych myszy na przestrzeń clip space
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

//     // Użycie Raycastera do znalezienia przecięć
//     raycaster.setFromCamera(mouse, camera)
//     const intersects = raycaster.intersectObject(model, true)

//     if (intersects.length > 0) {
//         const intersect = intersects[0]
//         const newLabel = createLabel(labels.length.toString());
//         labels.push(newLabel);
//         console.log(intersect.point.x , intersect.point.y , intersect.point.z)
//         newLabel.position.set(intersect.point.x , intersect.point.y , intersect.point.z)
//         scene.add(newLabel)
//     }
// });