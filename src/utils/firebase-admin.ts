import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as _ from 'lodash';
import { NotFoundException } from '@nestjs/common';

const userField = [
  'uid',
  'email',
  'emailVerified',
  'disabled',
  'metadata',
  'providerData',
];

let db;

export const firebaseAdmin = async (projectId: string) => {
  const app = admin.initializeApp({
    credential: admin.credential.cert(
      require('../../../firebase.private.json'),
    ),
    projectId,
  });
  db = getFirestore(app);
  return app;
  // console.log(await db.collection('messages').doc('dJBZO05jKI8vr7FenfIA').get())
};

export const firebaseAdminGetUsers = () => {
  // admin.auth().createUser({
  //   email: 'a1@mailinator.com',
  //   password: '123456',
  //   photoURL: `https://firebasestorage.googleapis.com/v0/b/test-8e32c.appspot.com/o/z4620002511106_1d3b672a3f6ec86808978b39fc3e2399.jpg?alt=media&token=afd58f80-a736-4729-938e-7397d4ca4a35`,
  //   displayName: 'Ada Wong',
  //   disabled: false,
  //   emailVerified: true,
  // });
  return admin
    .auth()
    .listUsers(1000)
    .then((usersRecord) => {
      const users = usersRecord.users.map((user) =>
        // _.pick(user.toJSON(), userField),
        user.toJSON(),
      );
      return users;
    })
    .catch((error) => {
      throw new NotFoundException(error);
    });
};

export const firebaseAdminGetUserByEmail = (email: string) => {
  return admin
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      return _.pick(user.toJSON(), userField);
    })
    .catch((error) => {
      throw new NotFoundException(error);
    });
};

export const firebaseAdminGetSessions = async () => {
  const ref = db.collection('sessions');
  const snapshot = await ref.get();
  return snapshot.docs.map((doc) => doc.data());
};

export const firebaseAdminGetUserSessions = async (userId: string) => {
  const ref = db.collection('sessions');
  const snapshot = await ref
    .where('participates', 'array-contains', userId)
    .get();
  return snapshot.docs.map((doc) => {
    return { ...doc.data() };
  });
};

export const firebaseAdminGetMessages = async (messageTopic: string) => {
  const ref = db.collection(messageTopic);
  const snapshot = await ref
    .where('status', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }))[0];
};

export const firebaseBatchMessages = async (messageTopic, messageUid) => {
  // const bulk = admin.firestore().bulkWriter();
  const ref = db.collection(messageTopic).doc(messageUid);

  if (ref.update({ status: true })) firebaseSendMessage();
  // const ref = db.collection(messageTopic).doc();
  // console.log(bulk.update(ref, { status: true }))
  // return await bulk.update(ref, { status: true });
};

export const firebaseAdminGetUserSessionById = async (sessionId: number) => {
  const ref = db.collection('sessions');
  const snapshot = await ref.where('id', '==', +sessionId).get();
  return snapshot.docs.map((doc) => doc.data())[0];
};

export const firebaseAdminGetUsersByListId = (uids: string[]) => {
  return admin
    .auth()
    .getUsers(uids.map((uid: string) => ({ uid })))
    .then((usersRecord) => {
      const users = usersRecord.users.map((user) =>
        _.pick(user.toJSON(), userField),
      );
      return users;
    })
    .catch((error) => {
      throw new NotFoundException(error);
    });
};

export const firebaseSendMessage = () => {
  return admin
    .messaging()
    .send({
      data: {
        score: 'You have received a new message',
        time: 'test',
      },
      token:
        'ewJg2q0n73M3qPtXVlnHYW:APA91bF4CO0kHnnIA1X0ud6lZwqb5lPMCEErNgA0_MRkx7vA_UE91WMkh9DQifCmsHvH9wGqH1UNZs3gI2hDxwZrVBsAnKz6CJTVdUsTs6roewDnqzRRpyXF1TOSGvftNow6x1fVXEpA',
    })
    .then((usersRecord) => {
      // const users = usersRecord.users.map((user) =>
      //   _.pick(user.toJSON(), userField),
      // );
      // return users;
      console.log(usersRecord);
    })
    .catch((error) => {
      throw new NotFoundException(error);
    });
};
