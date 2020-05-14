async function findDocument(query) {
  return await query.exec(async (err, res) => {
    if (err) {
      console.log(`Error while executing find query: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

async function createDocument(query) {
  return await query.save(async (err, res) => {
    if (err) {
      console.log(`Error while executing create query: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

async function deleteDocument(query) {
  await query.exec(async (err) => {
    if (err) {
      console.log(`Error while executing delete query: ${JSON.stringify(err)}`);
      return false;
    } else {
      return true;
    }
  });
}

async function updateDocument(query) {
  return await query.exec(async (err, res) => {
    if (err) {
      console.log(`Error occured while executing update query: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

async function updateDocumentWithValidation(query) {
  return await query.save(async (err, res) => {
    if (err) {
      console.log(`Error while executing updating query with validation: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

module.exports = {
  findDocument, createDocument, deleteDocument, updateDocument, updateDocumentWithValidation
}
