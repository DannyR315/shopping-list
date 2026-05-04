const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();

exports.notifyOnCheckout = onDocumentCreated('checkouts/{checkoutId}', async (event) => {
  const data = event.data.data();
  const { itemNames = [], senderToken } = data;

  // Clean up the trigger document immediately
  await event.data.ref.delete();

  const tokensSnap = await getFirestore().collection('tokens').get();
  const tokens = tokensSnap.docs
    .map(d => d.data().token)
    .filter(t => t && t !== senderToken);

  if (tokens.length === 0) return;

  const body = `${itemNames.length} item${itemNames.length !== 1 ? 's' : ''} completed`;

  await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title: 'Shopping list updated', body },
  });
});
