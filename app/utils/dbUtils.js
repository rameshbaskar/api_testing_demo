async function execFind(query) {
  return await query.exec(async (err, res) => {
    if (err) {
      console.log(`Error while executing find query: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

async function execCreate(query) {
  return await query.save(async (err, res) => {
    if (err) {
      console.log(`Error while executing create query: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

async function execDelete(query) {
  await query.exec(async (err) => {
    if (err) {
      console.log(`Error while executing delete query: ${JSON.stringify(err)}`);
      return false;
    } else {
      return true;
    }
  });
}

async function execUpdate(query) {
  return await query.exec(async (err, res) => {
    if (err) {
      console.log(`Error occured while executing update query: ${JSON.stringify(err)}`);
      return null;
    } else {
      return res;
    }
  });
}

async function execUpdateWithValidation(query) {
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
  execFind, execCreate, execDelete, execUpdate, execUpdateWithValidation
}
