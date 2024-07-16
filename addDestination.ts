//import firebase from 'firebase/compat/app';
import { auth, firestore } from './config/firebaseConfig';


interface Destination {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

const destinations: Destination[] = [
  {
    name: "Everest Base Camp",
    description: "The Everest Base Camp trek is one of the most popular trekking routes in the Himalayas and a dream for many adventure seekers.",
    imageUrl: "https://www.halfwayanywhere.com/wp-content/uploads/2018/09/Everest-Base-Camp-Header-750x422.jpg",
    category: "adventure"
  },
  {
    name: "Annapurna Circuit",
    description: "The Annapurna Circuit is a trek within the mountain ranges of central Nepal. It is known for its diverse landscape and cultural variety.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/Annapurna_Circuit_2.jpg?20121102182822",
    category: "adventure"
  },
  {
    name: "Paragliding in Pokhara",
    description: "Pokhara is known for its adventure sports, with paragliding being one of the most popular activities. It offers stunning views of the Annapurna range.",
    imageUrl: "https://adventureclubtrek.com/uploads/img/paragliding-in-pokhara-1day-1024.jpg",
    category: "adventure"
  },
  {
    name: "Chitwan National Park",
    description: "Chitwan National Park is a preserved area in the Terai Lowlands of south-central Nepal, known for its biodiversity and wildlife safaris.",
    imageUrl: "https://www.wendywutours.com.au/resource/upload/914/banner-chitwan-national-park-2x-mob.jpg",
    category: "nature"
  },
  {
    name: "Rara Lake",
    description: "Rara Lake is the largest lake in Nepal, located in the far northwest. It is a serene and beautiful place, perfect for nature lovers.",
    imageUrl: "https://mountadventureholidays.com/uploads/2023/06/rara-lake.jpg",
    category: "nature"
  },
  {
    name: "Sagarmatha National Park",
    description: "Home to Mount Everest, Sagarmatha National Park is known for its rugged terrain, deep gorges, and glaciers.",
    imageUrl: "https://tigerencounter.com/wp-content/uploads/2019/11/Sagarmatha-National-Park-1024x512.jpg",
    category: "nature"
  },
  {
    name: "Kathmandu Durbar Square",
    description: "Kathmandu Durbar Square is a historic landmark in the heart of Kathmandu, featuring palaces, courtyards, and temples that date back to the Malla period.",
    imageUrl: "https://media.istockphoto.com/id/519624147/photo/kathmandu.jpg?s=612x612&w=0&k=20&c=-EkLH11s65SVPDMK4tYR5ecqeNMJLkEkOXeXWM8hjMU=",
    category: "historical"
  },
  {
    name: "Bhaktapur Durbar Square",
    description: "Bhaktapur Durbar Square is a UNESCO World Heritage Site known for its well-preserved courtyards, temples, and royal palace.",
    imageUrl: "https://media.istockphoto.com/id/1346876863/photo/bhaktapur-in-kathmandu-valley-nepal.jpg?s=612x612&w=0&k=20&c=qEyt6yfDTV4J3vsb6OZr-JP8RsHOsPk8PnjX_wu1csE=",
    category: "historical"
  },
  {
    name: "Lumbini",
    description: "Lumbini is the birthplace of Siddhartha Gautama (Buddha) and is a major pilgrimage site. It features various monasteries and the sacred Bodhi tree.",
    imageUrl: "https://ghoomnaphirna.com/wp-content/uploads/2019/01/Lumbini2-1024x682.jpg",
    category: "historical"
  }
];

// const addDestinationsToFirestore = async () => {
//     try {
//       await auth.signInAnonymously(); // Ensure the user is authenticated
//       const batch = firestore.batch();
  
//       destinations.forEach(destination => {
//         const docRef = firestore.collection('destinations').doc();
//         batch.set(docRef, destination);
//       });
  
//       await batch.commit();
//       console.log('Destinations added to Firestore');
//     } catch (error) {
//       console.error('Error adding destinations to Firestore:', error);
//     }
//   };
  
//   addDestinationsToFirestore().catch(console.error);

const addDestinationsToFirestore = async () => {
    try {
      const batch = firestore.batch();
  
      destinations.forEach(destination => {
        const docRef = firestore.collection('destinations').doc();
        batch.set(docRef, destination);
      });
  
      await batch.commit();
      console.log('Destinations added to Firestore');
    } catch (error) {
      console.error('Error adding destinations to Firestore:', error);
    }
  };
  
  addDestinationsToFirestore().catch(console.error);
