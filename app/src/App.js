import React, { useState } from 'react';

import Navigation from './routes/navigations';
import AddAccount from './screens/auth/AddAccount';
import ContactDetails from './screens/contacts/ContactDetails';


export default () => <Navigation />;

/**
 * Pour tester rapidement une page on peut faire :
 * export default () => <ContactDetails />;
 */
