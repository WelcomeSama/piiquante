const Sauce = require("../models/sauce");
const fs = require("fs");
const { request } = require("http");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré " }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié " }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/* exports.likeSauce = (req, res, next) => {
  console.log('toto');
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
 
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      const sauceUpdate = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: Number(0),
       dislikes: 0
      };
      sauceUpdate.likes = 0;
    
      switch (like) {
        case 1: //like
         // sauceUpdate.usersLiked.push(userId);
         // sauceUpdate.likes = new Number(sauceUpdate.usersLiked.length);
         
          break;

        case 0: //annulation like/dislike

          break;

        case -1: //dislike

          break;

        default:
          break;
      }

      
      Sauce.updateOne({ _id: userId }, sauceUpdate)
        .then(() => res.status(200).json({ message: "" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
}; */

exports.likeSauce = (req, res, next) => {
  console.log('toto');
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
      .then(sauce => {
         
          const sauceUpdate = {
              usersLiked: sauce.usersLiked,
              usersDisliked: sauce.usersDisliked,
              likes: 0,
              dislikes: 0
          }
          
          switch (like) {
              case 1:  // sauce like
                  sauceUpdate.usersLiked.push(userId);
                  break;
              case -1:  // sauce dislike
                  sauceUpdate.usersDisliked.push(userId);
                  break;
              case 0:  //Annulation du like/dislike
                  if (sauceUpdate.usersLiked.includes(userId)) {
                      // si on annule le like
                      const index = sauceUpdate.usersLiked.indexOf(userId);
                      sauceUpdate.usersLiked.splice(index, 1);
                  } else {
                      // si on annule le dislike
                      const index = sauceUpdate.usersDisliked.indexOf(userId);
                      sauceUpdate.usersDisliked.splice(index, 1);
                  }
                  break;

                  default:
                    break;
          };
          // Calcul du nombre de likes / dislikes
          sauceUpdate.likes = sauceUpdate.usersLiked.length;
          sauceUpdate.dislikes = sauceUpdate.usersDisliked.length;
          // Mise à jour de la sauce avec les nouvelles valeurs
          Sauce.updateOne({ _id: sauceId }, sauceUpdate )
              .then(() => res.status(200).json({ message: 'Sauce notée' }))
              .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error }));
}