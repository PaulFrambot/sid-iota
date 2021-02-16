// Pulled from https://randomuser.me/documentation
export default [

    /*[ {'firstname' : '' , 'lastname' : '', 'messages' : '', 'timestamp' : '', address: ''}, ...]
  où messages ={'id' :,
                'received' :,
                'timestamp' : ,
                'type' : ,
                'content' : }
*/
  {
    id: 1,
    firstname: "Octave",
    lastname: "Le Tullier",
    address: " adresse d octave",
    messages: [{
      id: 1,
      received: true,
      timestamp: 1334023,
      type : 1,
      content : 'dégagez louis du groupe',
    },
    {
      id: 2,
      received: true,
      timestamp: 1334023,
      type : 1,
      content : 'nan je rigole',
    }], 
  },
  {
    id: 2,
    firstname: "Antoine",
    lastname: "Gicquel",
    address: " adresse d antoine",
    messages: [{
      id: 1,
      received: true,
      timestamp: 1334023,
      type : 1,
      content : "j'aime la flutte",
    },
    {
      id: 2,
      received: true,
      timestamp: 1334023,
      type : 1,
      content : 'et la pizza hawaienne',
    }], 
  }]
  