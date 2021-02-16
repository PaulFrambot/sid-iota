import * as React from 'react';
import {View, TextInput, Text, StyleSheet, Alert, ImageBackground, ScrollView} from 'react-native';
import {AuthContext} from '../../context-variable/context';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button} from 'native-base';
import * as theme from '../../shared/Theme';
import { globalStyles } from '../../shared/GlobalStyles.js';
import { startProcessingMessages } from '../../backend/Tangle/tangleListeners';
import {LinearGradient} from "expo-linear-gradient";
import {SHA256Async} from '../../backend/crypto'
import {SALT} from '../../backend/salt'
import { createAllTables } from '../../backend/models'

export default function SignInScreen({route}) {
  const { account } = route.params;
  const { signIn, getUser, setUser } = React.useContext(AuthContext);

  const signInAccountSchema = yup.object({
    password: yup.string()
      .required("Veuillez renseigner un mot de passe")
      .max(30, "Le mot de passe ne peut pas excéder 30 caractères ")
      .test("", "Le mot de passe est incorrect",async (value) => {return (await SHA256Async(value + SALT)) === account.password_hash }),
  });

  return (
    <ImageBackground source={require('../../assets/logos/Logo_colored_resized_bottom.png')}
                     style={styles.img}>
      <LinearGradient
          colors={["#09203f", "#537895"]}
          start={[0.1, 0.1]}
          style={styles.linearGradient}
        >
        <ScrollView style={{flex: 1}}>
        <View style={styles.section}>
          <Formik
            initialValues={{ password:''}}
            validationSchema={signInAccountSchema}
            onSubmit={(values, actions) => {
              actions.resetForm();
              setUser(account)
              signIn().then( () =>{
                createAllTables();
                startProcessingMessages(getUser().id)
              });
            }}
          >
            {props => (
              <View>
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
                <Button
                  rounded
                  primary
                  block
                  style={{backgroundColor:theme.colors.blue}}
                  onPress={props.handleSubmit}
                  >
                  <Text style={{color:'white', fontSize:15, fontWeight: "bold"}}>Se connecter</Text>
                </Button>
              </View>
            )}
          </Formik>
        </View>
        </ScrollView>
        </LinearGradient>
      </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: "100%",
    opacity: 0.95,
    backgroundColor: '#fff',
    justifyContent: 'center',

  },
  section: {
    flexDirection: "column",
    justifyContent: 'center',
    padding: 20,
    marginTop: 130,
    //marginBottom: 20,
  },
  input: {
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
