export class UsersDigestValueConverter {
  //Receives the users object and returns digest object for sidebar
  toView(users) {
    console.log('updating digest');
    var output = {'total' : 0, tags : {}};
    if (typeof users === 'object') {
      users.forEach((user) => {
        console.log(tags);
        var tags = Object.keys(user.tags)
        tags.forEach((tag) => {
          if(typeof output.tags[tag] === 'undefined') {
            output.tags[tag] = 0;
          }
          if(user.tags[tag]) {
            output.tags[tag]++;
          }
        });
        output.total++;
      });
    }
    return output
  }
}

