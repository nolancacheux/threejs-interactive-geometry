
// **Initialisation des variables**
// Ces variables sont nécessaires pour la scène 3D et le rendu
let scene, camera, renderer; 
let controlPointMeshes = [], controlPolygon, bezierCurve; // Les points de contrôle, le polygone de contrôle, et la courbe de Bézier
let controlPoints = []; // Stocke les points de contrôle
let bezierCurves = []; // Stocke les courbes de Bézier
let bernsteinBase = []; //fonctions de base de bernstein
// Variables pour gérer les interactions avec la souris
let mouse = new THREE.Vector2();

// D'autres vecteurs et objets nécessaires pour la manipulation de la courbe
let intersectionPoint = new THREE.Vector3();
let dragPoint = new THREE.Vector3();
let planeNormal = new THREE.Vector3();
let plane = new THREE.Plane(); // Un plan pour les intersections
let raycaster = new THREE.Raycaster(); // Pour détecter les objets sous la souris
let draggable; // L'objet qui peut être déplacé

// Pour gérer les boutons dans l'interface utilisateur
let activeButton = null;

// **Fonctions**

// Basculer l'affichage de la courbe de Bézier
function toggleBezierDisplay(method) {
    // Suppression des courbes précédentes
    bezierCurves.forEach(curve => scene.remove(curve));
    bezierCurves = [];
    bernsteinBase.forEach(base => scene.remove(base));
    bernsteinBase = [];


    // Si un bouton est déjà actif, le désactiver
    if (activeButton) {
        activeButton.classList.remove('active');
    }

    // Si le bouton actif est le même que celui qui a été cliqué, le désactiver
    if (activeButton && activeButton.dataset.method === method) {
        activeButton = null;
        return;
    }

    // Activer le bouton cliqué
    const button = document.querySelector(`[data-method="${method}"]`);
    button.classList.add('active');
    activeButton = button;
    
    // Mise à jour de la courbe de Bézier selon la méthode choisie
    chooseMethod(method);
}

// Initialisation de la scène 3D
function init() {
    // Création de la scène
    scene = new THREE.Scene();

    // Configuration du rendu avec un fond blanc et l'anti-aliasing activé
    renderer = new THREE.WebGLRenderer({ antialias: true, background: new THREE.Color(0xeeeeee) });
    renderer.setSize(window.innerWidth*0.5, window.innerHeight*0.8);

    // Attacher le rendu à un élément HTML
    const div = document.getElementById('threejs');
    div.appendChild(renderer.domElement);

    // Configuration de l'apparence du rendu
    const stl = renderer.domElement.style;
    stl.position = "relative";
    stl.zIndex = "10";

    // Configuration de la caméra
    const rect = renderer.domElement.getBoundingClientRect();
    camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
    camera.position.z = 5;

    // Ajout d'une lumière directionnelle pour éclairer la scène
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(0, 0, 100);

    // Ajout d'axes pour aider à se repérer dans la scène
    const helper = new THREE.AxesHelper(20);
    scene.add(helper);

    // Configuration des événements de la souris
    renderer.domElement.addEventListener("mouseup",onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Lancer l'animation
    animate();
}

// Gérer le mouvement de la souris
function onMouseMove(e){
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX -rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}

// Ajuster la taille du rendu lorsque la fenêtre est redimensionnée
function onWindowResize() {
    const frustumSize = 1;

    const aspect = window.innerWidth / window.innerHeight;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
// La boucle d'animation
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}

// Ajouter un point de contrôle depuis les champs d'input
function addPointFromInput(){
    let x = document.getElementById("xcoord").value;;
    let y = document.getElementById("ycoord").value;
    console.log(x,y)
    let newPoint = new THREE.Vector3(x,y,0);
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
    addPoint(newPoint);
}

// Ajouter un point de contrôle en cliquant
function addPointFromClick(){    
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    addPoint(intersectionPoint);
}

// Ajouter un point à la scène
function addPoint(pos){
    bezierCurves.forEach(curve => scene.remove(curve));
bezierCurves = [];

    const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.0325, 30, 30),
        new THREE.MeshStandardMaterial({
        color: 0xffea00,
        metalness: 0,
        roughness: 0
        })
    );
    scene.add(sphereMesh);
    sphereMesh.userData.draggable = true
    sphereMesh.userData.id = controlPoints.length

    sphereMesh.position.copy(pos);
    controlPointMeshes.push(sphereMesh);
    controlPoints.push(sphereMesh.position)

        // Mettre à jour la courbe de Bézier si un bouton est activé
        if (activeButton) {
            chooseMethod(activeButton.dataset.method);
        }
        updateControlPolygon()
        updateTable(controlPointMeshes)
    
}

// Gérer les clics de la souris
function onMouseUp(event) {
    if(event.button == 0){
        addPointFromClick();
    }
    else if(event.button == 1){

        if (draggable != null) {
            
            var mId = scene.children.findIndex(m => {
                return m.position === draggable.position;
            })


            planeNormal.copy(camera.position).normalize();
            plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(plane, dragPoint);

            scene.children[mId].position.copy(dragPoint)
            controlPointMeshes[draggable.userData.id].position = scene.children[mId].position;
            controlPoints[draggable.userData.id] =scene.children[mId].position;

            updateControlPolygon();
            if (activeButton) {
                chooseMethod(activeButton.dataset.method);
            }
            
            updateTable(controlPointMeshes)

            draggable = null;
            return;
        }
    
        // THREE RAYCASTER
        const found = intersect(mouse);
        for (let i = 0; i < found.length; i++) {
            if (!found[i].object.userData.draggable)
                continue
            console.log(found[i].object)
            draggable = found[i].object
        }
    }

  }

// Trouver les objets sous le curseur
  function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
  }

// Mise à jour du polygone de contrôle
function updateControlPolygon() {
    if (controlPolygon) {
        scene.remove(controlPolygon);
    }
    console.log(controlPoints)
    const geometry = new THREE.BufferGeometry().setFromPoints(controlPoints);
    const material = new THREE.LineBasicMaterial({ color: "white" });
    controlPolygon = new THREE.Line(geometry, material);
    scene.add(controlPolygon);
}

// Fonction pour calculer le coefficient binomial
function binomialCoefficient(n, k) {
    let coeff = 1;
    for (let x = n - k + 1; x <= n; x++) coeff *= x;
    for (let x = 1; x <= k; x++) coeff /= x;
    return coeff;
}

// Mets à jour la courbe de Bézier en utilisant les fonctions de base de Bernstein
function updateBezierCurve() {
    if (bezierCurve) {
        scene.remove(bezierCurve);
    }
    const curvePoints = [];
    for (let t = 0; t <= 1; t += 0.01) {
        let curvePoint = new THREE.Vector3();
        const n = controlPoints.length - 1;
        for (let i = 0; i <= n; i++) {
            const bernstein = binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
            curvePoint.add(controlPoints[i].clone().multiplyScalar(bernstein));
        }
        curvePoints.push(curvePoint);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Courbe de Bézier en vert
    bezierCurve = new THREE.Line(geometry, material);
    scene.add(bezierCurve);
}
// Fonctions pour effacer et réinitialiser la courbe
function clearGraph(){
    bernsteinBase.forEach(base => scene.remove(base));
    bernsteinBase = [];

    for( var i = scene.children.length - 1; i >= 0; i--) { 
        obj = scene.children[i];
        scene.remove(obj); 
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(0, 0, 100);

    const helper = new THREE.AxesHelper(20);
    scene.add(helper);

    controlPointMeshes = [], controlPolygon, bezierCurve;
    controlPoints = [];
    

   clearTable()
}


// fnction pour calculer les points de la fonction de base de Bernstein
function bernsteinBaseFunctionPoints(n, i, numPoints = 100) {
    const points = [];
    for (let t = 0; t <= 1; t += 1 / numPoints) {
        const bernstein = binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
        // let f = controlPoints[i].clone().multiplyScalar(bernstein);
        // points.push(new THREE.Vector3(t, f, 0));  // z is 0 because we want 2D visualization
        points.push(new THREE.Vector3(t, bernstein, 0));  // z is 0 because we want 2D visualization
    }
    return points;
}

// apres on vient ajouter la fonction de base de Bernstein à la scène
function addBernsteinBaseToScene(n, i, color) {
    const points = bernsteinBaseFunctionPoints(n, i);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    bernsteinBase.push(line);
    return line;  
}


// Afficher la courbe de Bézier en utilisant les fonctions de base de Bernstein
function showBezierUsingBernstein() {
    const curvePoints = [];
    for (let t = 0; t <= 1; t += 0.01) {
        let curvePoint = new THREE.Vector3();
        const n = controlPoints.length - 1;
        for (let i = 0; i <= n; i++) {
            const bernstein = binomialCoefficient(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
            curvePoint.add(controlPoints[i].clone().multiplyScalar(bernstein));
            addBernsteinBaseToScene(n,i,"cyan")
        }
        curvePoints.push(curvePoint);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({ color: 0xADD8E6 });  // Light blue
    const curve = new THREE.Line(geometry, material);
    bezierCurves.push(curve);
    scene.add(curve);
}

// Afficher la courbe de Bézier en utilisant l'algorithme de De Casteljau
function showBezierUsingDeCasteljau() {
    const curvePoints = [];
    for (let t = 0; t <= 1; t += 0.01) {
        curvePoints.push(deCasteljau(controlPoints, t));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({ color: 0xFFFF00 });  // Yellow
    const curve = new THREE.Line(geometry, material);
    bezierCurves.push(curve);
    scene.add(curve);
}

// Calculer un point sur la courbe de Bézier à l'aide de l'algorithme de De Casteljau
function deCasteljau(points, t) {
    if (points.length === 1) return points[0];

    const newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
        newPoints.push(points[i].clone().lerp(points[i + 1], t));
    }
    return deCasteljau(newPoints, t);
}

// Choisir la méthode de tracé de la courbe de Bézier
function chooseMethod(method) {
    bezierCurves.forEach(curve => scene.remove(curve));
    bezierCurves = [];
    bernsteinBase.forEach(base => scene.remove(base));
    bernsteinBase = [];


    currentMethod = method;
    if (method === 'bernstein') {
        showBezierUsingBernstein();
    } else if (method === 'deCasteljau') {
        showBezierUsingDeCasteljau();
    }
}

// Appliquer des courbes prédéfinies
function applyPresetCurve(applicationNumber) {
    clearGraph(); // Réinitialiser le graphique
    let presetPoints = [];

    switch (applicationNumber) {
        case 1:
            presetPoints = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1, 0, 0)
            ];
            break;
        case 2:
            presetPoints = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 1, 0)
            ];
            break;
        case 3:
            presetPoints = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 0, 0)
            ];
            break;
    }

    presetPoints.forEach(point => addPoint(point));
    if (currentMethod === 'bernstein') {
        showBezierUsingBernstein();
    } else if (currentMethod === 'deCasteljau') {
        showBezierUsingDeCasteljau();
    }
}

// Transformations :
function applyTranslation() {
    let dx = parseFloat(document.getElementById("translateX").value);
    let dy = parseFloat(document.getElementById("translateY").value);

    controlPoints.forEach(point => {
        point.x += dx;
        point.y += dy;
    });
    updateControlPolygon();
    chooseMethod(currentMethod)
    // updateBezierCurve();
}

function applyScale() {
    let scale = parseFloat(document.getElementById("scale").value);

    controlPoints.forEach(point => {
        point.x *= scale;
        point.y *= scale;
    });

    updateControlPolygon();
    chooseMethod(currentMethod)

    // updateBezierCurve();
}

function applyRotation() {
    let angle = parseFloat(document.getElementById("rotation").value) * (Math.PI / 180); // Convert degrees to radians

    controlPoints.forEach(point => {
        let x = point.x;
        point.x = x * Math.cos(angle) - point.y * Math.sin(angle);
        point.y = x * Math.sin(angle) + point.y * Math.cos(angle);
    });

    updateControlPolygon();
    chooseMethod(currentMethod)

    // updateBezierCurve();
}

function combineTransformations() {
    applyTranslation();
    applyScale();
    applyRotation();
}


init();
