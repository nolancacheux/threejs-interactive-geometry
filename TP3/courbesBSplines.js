
// **Initialisation des variables**
// Ces variables sont nécessaires pour la scène 3D et le rendu
let scene, camera, renderer; 
let controlPointMeshes = [], controlPolygon; // Les points de contrôle, le polygone de contrôle, et la courbe de Bézier
let controlPoints = []; // Stocke les points de contrôle
let bezierCurves = []; // Stocke les courbes de Bézier
let bernsteinBase = []; //fonctions de base de bernstein

let BSplineCurves = [];
let BSplineBases = [];


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
let currentMethod = "";
let currentVector = [];
let currentDegree = 1;

// **Fonctions**

// Basculer l'affichage de la courbe de Bézier
function toggleBezierDisplay(method) {
    // Suppression des courbes précédentes
    // BSplineCurves.forEach(curve => scene.remove(curve));
    // BSplineCurves = [];
    // BSplineBases.forEach(base => scene.remove(base));
    // BSplineBases = [];


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

    $("#degreeValue").text(currentDegree.toString())

    $("#vectorValue").text("["+currentVector.toString()+"]")

    // changeDegree();
    // changeVector();
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
    // il faut update le vecteur nodal
}

function getLineFromPoints(points,color,addToScene=true){
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    let mesh = new THREE.Line(geometry, material);
    if(addToScene){
        scene.add(mesh);
    }
    return mesh
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
    BSplineCurves.forEach(curve => scene.remove(curve));
    BSplineCurves = [];

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
    updateControlPolygon()

        // Mettre à jour la courbe de Bézier si un bouton est activé
        if (activeButton) {
            currentVector = generateVecNodal(controlPoints.length-1,currentDegree);
            chooseMethod(activeButton.dataset.method);
        }
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
    controlPolygon = getLineFromPoints(controlPoints,"white",addToScene=true);
}


// Fonctions pour effacer et réinitialiser la courbe
function clearGraph(){
    // BSplineBases.forEach(base => scene.remove(base));
    BSplineBases = [];

    for( var i = scene.children.length - 1; i >= 0; i--) { 
        obj = scene.children[i];
        scene.remove(obj); 
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(0, 0, 100);

    const helper = new THREE.AxesHelper(20);
    scene.add(helper);

    controlPointMeshes = [], controlPolygon;
    controlPoints = [];
    BSplineCurves = [];
    
   clearTable()
}

function getBSplinesBase(m,pos,t,i){
    //condition de retour
    if(m == 0)
    {
        if(t[i]<=pos && pos < t[i+1])
            return 1.0;
        else
            return 0.0;
    }
    let coefGauche;
    let coefDroite;
    if(t[i+m] == t[i])
        coefGauche = 0.0
    else
        coefGauche = (pos-t[i])/(t[i+m]-t[i]) * getBSplinesBase(m-1,pos,t,i)
    
    if(t[i+m+1] == t[i+1])
        coefDroite = 0.0
    else
        coefDroite = (t[i+m+1]-pos)/(t[i+m+1]-t[i+1]) * getBSplinesBase(m-1,pos,t,i+1)
        
    // console.log(coefDroite,coefGauche,coefDroite+coefGauche)
    // scene.add(line);
    return coefDroite+coefGauche

}

// reconstruit et affiche les fonction de base de spline
//t = vecteur nodal
//m = degré
//i = i eme base
// numPoints = param de précision
function buildBsplineBase(t,m,i,numPoints = 100) {
    let points = [];
    for (let x = 0; x <= 1; x += 1 / numPoints) {
        let base = getBSplinesBase(m,x,t,i);
        points.push(new THREE.Vector3(x, base, 0));  // en 2D => coordonnée z = 0
    }
    return points;
}

// Fonction ajoutant la Base de Spline N_i^m(x) avec le vecteur nodal t
function addBsplineBaseToScene(t,m,i) {
    let base = buildBsplineBase(t,m,i);
    const line = getLineFromPoints(base,"cyan",addToScene=false)
    if(!BSplineBases.find((el) => el == line)){
        BSplineBases.push(line);
        scene.add(line);
    }
    return line;  
}

//m = degree
//t = vecteur nodal
//nbCtrl : nb de points de contrôle
function buildBsplineCurve(m,t){
    let n = t.length-1; // nb noeuds -1
    let curvePoints = [];
    for (let x = t[m]; x <= t[n-m]; x += 0.01) // précision ou position
    {
        let curvePoint = new THREE.Vector3();
        for (let i = 0; i <n-m; i++) {
            const BaseSpline_N = getBSplinesBase(m,x,t,i) //fonction de base N_i^m(t)
            console.log(controlPoints.length,i,controlPoints[i])
            const bspline_i = controlPoints[i].clone().multiplyScalar(BaseSpline_N) // un point sur la bspline
            curvePoint.add(bspline_i)
            addBsplineBaseToScene(t,m,i); // ajouter une base à la scene
        }
        curvePoints.push(curvePoint);
    }
    return curvePoints
}

// géneration du vecteur nodal entre 0 et 1 avec n+m+1 noeuds
// n = nombre de points de controle - 1 
// m = degré de la courbe 
function generateVecNodal(n,m){
    let vec = [];
    for(let i = 0;i<n+m+1;i++){
        vec.push(Math.random());
    }
    vec.sort()
    return vec;
}


// Choisir la méthode de tracé de la courbe de Bézier
function chooseMethod(method) {
    BSplineCurves.forEach(curve => scene.remove(curve));
    BSplineCurves = [];
    BSplineBases.forEach(base => scene.remove(base));
    BSplineBases = [];

    let curve;
    currentMethod = method;

    console.log(currentDegree)
    if (method === 'base') {
        let degree = currentDegree;
        // il faut nbCtrl+degree+1 noeuds dans le vecteur nodal
        // let vecteurNodal = generateVecNodal(controlPoints.length-1,degree);

        curve = buildBsplineCurve(degree,currentVector);
        // currentVector = vecteurNodal;
    } else if (method === 'boor') {
        // showBezierUsingDeCasteljau();
        // curve = BSplineBoorCurve()
    }
    else{
        return
    }
    const newCurve = getLineFromPoints(curve,"yellow",addToScene=true);
    BSplineCurves.push(newCurve);

    // console.log(MathcurrentVector)
    // $("#vectorValue").text("["+currentVector.toString()+"]")

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



init();

//
// fonctions utilisateurs
//
function changeDegree(e){
    let degree = document.getElementById("degree").value;
    // let space = Math.round(Math.random()*10)
    if(degree){
        currentDegree = parseInt(degree)
    }
    else{
        currentDegree = 1;
    }
    // let vecteurNodal = [1,1,2,3,4,4,5,6]
    document.getElementById("degreeValue").innerHTML = currentDegree;
    console.log(currentDegree)

    chooseMethod(currentMethod);
    return degree
}

function changeVector(vec){
    console.log(vec)
    
    // custom
    if(vec == []){
        let vector = document.getElementById("vector").value;
        currentVector = vector;
    }
    //random 
    else if(vec == -1){
        currentVector = generateVecNodal(controlPoints.length-1,currentDegree);
    }
    currentVector=currentVector.map((el) => Math.round(el*100)/100);
    $("#vectorValue").text("["+currentVector.toString()+"]")
    console.log(currentVector)

    chooseMethod(currentMethod)
}

// faire une fonction qui genere les fct de base et les évalues APRES en chaque 