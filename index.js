  let textToken = await admin.firestore().collection('Users').doc(`${event.source.userId}`).get();
  let userIdToken = textToken.data().TokenId;

  if (event.message.type === 'text' && event.message.text.length === 43) { 
    let defultScript = await admin.firestore().collection('Script').doc(`script0`).get();
    let defult = defultScript.data().messagetext; 
    
    let inputText = event.message.text;
     await admin.firestore().collection('Users').doc(`${event.source.userId}`).set({
        TokenId: inputText
     });

    reply(event.replyToken, {type: 'text', text: "ทำการบันทึก Token ของคุณเรียบร้อยแล้ว"})
   
    lineNotify(inputText, defult);

    await admin.firestore().collection('status').doc(`${event.source.userId}`).set({
      prepareText: defult
    });

  } else if (event.type === 'message' && event.message.type === 'audio'){
        // const urls = await upload(event, msg);
        let beforeSc = await admin.firestore().collection('status').doc(`${event.source.userId}`).get();
        let beforeScirpt = beforeSc.data().prepareText;

        const urls = await upload(event, beforeScirpt);
        await reply(event.replyToken, { type: "text", text: urls});

        let randomNumber = Math.floor(Math.random() * 11);
        let script = await admin.firestore().collection('Script').doc(`script${randomNumber}`).get();
        let msg = script.data().messagetext;

        await admin.firestore().collection('status').doc(`${event.source.userId}`).set({
          prepareText: msg
        });

        await countTime(userIdToken, msg);

  } else {
        reply(event.replyToken, { type: "text", text: "กรุณาส่งกลับมาใหม่อีกครั้งครับ"});
  }
   

  return res.end(); 
