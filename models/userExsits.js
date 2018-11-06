const userExsits = function(data) {
  if (data.FaceMatches.length === 0) {
    return {
      status:false,
      userId:null
    };
  } else if (data.FaceMatches.length > 0) {
    return {
      status:true,
      userId:data.FaceMatches[0].Face.ExternalImageId
    };
  }
}

module.exports = userExsits;
