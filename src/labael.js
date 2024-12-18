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
            x: 4.32,
            y: 5.82,
            z: 1.97
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
        }
    },
    {
        x: 0.6497142614848816,
        y: 4.855132754519085,
        z: -2.4763185376751817,
        cameraPosition: {
            x: 6.11,
            y: 4.21,
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
        }
    },
    {
        x: 1.2652953426787708,
        y: 3.807800992397582,
        z: 2.932147920550089,
        cameraPosition: {
            x: 1.17,
            y: 4.03,
            z: 4.1
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
        }
    },
    {
        x: -0.44240203938218403,
        y: 4.081122732199145,
        z: 2.619998222864781,
        cameraPosition: {
            x: -0.27,
            y: 4.63,
            z: 6.05
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
        }
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
        }
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