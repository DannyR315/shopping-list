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
  const tokens = [...new Set(
    tokensSnap.docs
      .map(d => d.data().token)
      .filter(t => t && t !== senderToken)
  )];

  if (tokens.length === 0) return;

  const nameList = itemNames.join(', ');
  const body = `${itemNames.length} item${itemNames.length !== 1 ? 's' : ''} completed: ${nameList}`;

  const result = await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title: 'Shopping list updated', body },
  });

  // Remove docs whose tokens are no longer valid
  const db = getFirestore();
  const invalidTokens = new Set(
    result.responses
      .map((r, i) => (!r.success ? tokens[i] : null))
      .filter(Boolean)
  );
  if (invalidTokens.size > 0) {
    const toDelete = tokensSnap.docs.filter(d => invalidTokens.has(d.data().token));
    await Promise.all(toDelete.map(d => db.collection('tokens').doc(d.id).delete()));
  }
});
