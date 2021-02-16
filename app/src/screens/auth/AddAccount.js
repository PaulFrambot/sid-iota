import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground
} from 'react-native';
import {AuthContext} from '../../context-variable/context';
import { Button} from 'native-base';
import * as theme from '../../shared/Theme';
import { globalStyles } from '../../shared/GlobalStyles.js';

import { Formik } from 'formik';
import * as yup from 'yup';
import {LinearGradient} from "expo-linear-gradient";
export default function AddAccount({navigation}) {

  const { signUp } = React.useContext(AuthContext);

  const addAccountSchema = yup.object({
    lastname: yup.string()
      .required("Veuillez remplir ce champ")
      .max(120, "Ce champs ne peut pas excéder 120 caractères"),
    firstname: yup.string()
      .required("Veuillez remplir ce champ")
      .max(120, "Ce champs ne peut pas excéder 120 caractères"),
    password: yup.string()
      .required("Veuillez renseigner un mot de passe")
      .max(30, "Le mot de passe ne doit pas excéder 30 caractères "),
    password2: yup.string()
      .required('Veuillez confirmer le mot de passe')
      .test("", "password doesnt match", function (value)  {return value === this.parent.password;} ),
  });

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <ImageBackground source={require('../../assets/logos/Logo_colored_resized_bottom.png')}
                       style={styles.img}>
        <LinearGradient
            colors={["#09203f", "#537895"]}
            start={[0.1, 0.1]}
            style={styles.linearGradient}
        >
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={{marginBottom:25, marginTop:10, textAlign:'center', color:'#fff' }}>
            SID ne collecte aucune de vos données, en conséquence, votre compte sera stocké sur ce téléphone.
            Une fonctionnalité de transfert de données sera bientôt disponible !
          </Text>
          <Formik
            initialValues={{lastname:'', firstname:'', password:'', password2:''}}
            validationSchema={addAccountSchema}
            onSubmit={(values, actions) => {
              actions.resetForm();
             signUp( values.firstname, values.lastname, values.password, true).then(navigation.goBack())
              .catch(function(error) {
                console.log('There has been a problem with sql operation: ' + error.message);
                });
            }}
          >
            {props => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  onChangeText={props.handleChange('lastname')}
                  onBlur={props.handleBlur('lastname')}
                  value={props.values.lastname}
                />
                <Text style={globalStyles.errorText}>{props.touched.lastname && props.errors.lastname}</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  onChangeText={props.handleChange('firstname')}
                  onBlur={props.handleBlur('firstname')}
                  value={props.values.firstname}
                />
                <Text style={globalStyles.errorText}>{props.touched.firstname && props.errors.firstname}</Text>

                <TextInput
                  style={styles.input}
                  placeholder='Mot de passe'
                  autoCapitalize = 'none'
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  secureTextEntry
                />
                <Text style={globalStyles.errorText}>{props.touched.password && props.errors.password}</Text>

                <TextInput
                  style={styles.input}
                  placeholder='Confirmez votre mot de passe'
                  autoCapitalize = 'none'
                  onChangeText={props.handleChange('password2')}
                  onBlur={props.handleBlur('password2')}
                  value={props.values.password2}
                  secureTextEntry
                />
                <Text style={globalStyles.errorText}>{props.touched.password2 && props.errors.password2}</Text>


                <Button
                  rounded
                  primary
                  block
                  style={{backgroundColor:theme.colors.blue}}
                  onPress={props.handleSubmit}
                  >
                  <Text style={{color:'white', fontSize:15, fontWeight: "bold"}}>S'inscrire</Text>
                </Button>

              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </TouchableWithoutFeedback>

  )
}


const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  container:{
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30
  },
  section: {
    flexDirection: "column",
    marginHorizontal: 14,
    marginBottom: 14,
    paddingBottom: 24,
    borderBottomColor: "#EAEAED",
    borderBottomWidth: 1
  },
  input: {
    backgroundColor:'rgba(65,73,101,0.7)',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
  },
  img: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  }
});
