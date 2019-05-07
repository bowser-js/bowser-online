import domready from 'domready';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

domready(() =>
{
	render(<App />,	document.getElementById('bowser-online-container'));
});
