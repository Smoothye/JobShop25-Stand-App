const firebaseConfig = {
  apiKey: "AIzaSyDtAwrkpkAjD__cDTkLhIaohOx7OSCE27E",
  authDomain: "test-auth-9088a.firebaseapp.com",
  projectId: "test-auth-9088a",
  storageBucket: "test-auth-9088a.firebasestorage.app",
  messagingSenderId: "223430698807",
  appId: "1:223430698807:web:e5b4adbcf1db03af6f9cb2",
  measurementId: "G-B0SRLRC2XK",
  databaseURL: "https://test-auth-9088a-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

var companyID = '';
var companyName = '';
var companyStand = 0;
var standKeys = '';
var standInfo = '';
var nrStands = 8;
  
firebase.auth().onAuthStateChanged(function (company) {

  if (company) {
    document.getElementById("log-in-button").style.display = "none";
    document.getElementById("log-out-button").style.display = "block";
    document.getElementById("log-in-message").style.display = "block";

    companyID = company.email.substring(0, company.email.indexOf('@'));
    companyID = companyID.charAt(0).toUpperCase() + companyID.slice(1);

    /* Retrieve company details */
    var companyDetails = database.ref('company/' + companyID);

    companyDetails.once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        companyName = data.name;
        companyStand = data.stand;
        console.log(companyName);
      }
    }).then(function () {
      document.getElementById("companyName").innerHTML = "Welcome, " + companyName +"!";

      /* Retrieve stand info */
      var stands = database.ref('stands/');

      stands.once('value', (snapshot) => {
        const data = snapshot.val();
        if(data) {
          standInfo = Object.values(data);
          standKeys = Object.keys(data);
        }
      }).then(
        function () {
          updateStands();
        }
      );
    }).catch((error) => {
      appendAlert(error.code, error.message, "danger");
    });

  } else {
    console.log("No company connected");
    document.getElementById("log-out-button").style.display = "none";
    document.getElementById("log-in-button").style.display = "block";
    document.getElementById("log-in-message").style.display = "none";

    /* Retrieve stand info */
    var stands = database.ref('stands/');

    stands.once('value', (snapshot) => {
      const data = snapshot.val();

      if(data) {
        standInfo = Object.values(data);
        standKeys = Object.keys(data);
      }
    }).then(
      function () {
        updateStands();
      }
    );
  }
});