const { FIREBASE_CONFIG } = require('../config');
const { initializeApp } = require('@firebase/app')
const { 
  getFirestore, collection, addDoc,
  getDocs, getDoc, doc, query, where,
  updateDoc, deleteDoc, setDoc, documentId,
} = require('@firebase/firestore');

const config = FIREBASE_CONFIG

const firebaseApp = initializeApp(config);
const firestore = getFirestore(firebaseApp);

const collections = {}

const getCollection = name => collections[name] = collections[name] || collection(firestore, name)

const addToCollection = (collectionName, item) => addDoc(
    getCollection(collectionName),
    item,
);

const updateInCollection = (collectionName, id, fields) => updateDoc(
  doc(firestore, collectionName, id), fields
)

const deleteFromCollection = (collectionName, id) => deleteDoc(
  doc(firestore, collectionName, id)
)

const addId = d => ({
    ...d.data(),
    id: d.id,
});

const getAllFromCollectoion = (collectionName) => getDocs(
    getCollection(collectionName)
).then(res => res.docs.map(addId));

const getById = (collectionName, id) => getDoc(
  doc(firestore, collectionName, id)
).then(res => res.data())

const getByIds = (collectionName, ids) => ids.length > 0 ? getDocs(query(
  getCollection(collectionName), where(documentId(), 'in', ids)
)).then(res => res.docs.map(addId)) : Promise.resolve([])

const getFromCollectionBetween = (collectionName, field, min, max) => getDocs(query(
  getCollection(collectionName), where(field, '>=', min), where(field, '<', max)
)).then(res => res.docs.map(addId))

const getFromCollectionEq = (collectionName, field, value) => getDocs(query(
  getCollection(collectionName), where(field, '==', value)
)).then(res => res.docs.map(addId))

const existsInCollection = (collectionName, id) => getDoc(
  doc(firestore, collectionName, id)
).then(doc => doc.exists())

const setToCollection = (collectionName, id, value) => setDoc(
  doc(firestore, collectionName, id), value
)

module.exports = {
    addToCollection,
    getAllFromCollectoion,
    getFromCollectionBetween,
    getFromCollectionEq,
    updateInCollection,
    deleteFromCollection,
    existsInCollection,
    setToCollection,
    getById,
    getByIds,
}
