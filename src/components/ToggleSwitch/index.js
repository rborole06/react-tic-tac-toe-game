
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';
import React, { Component } from 'react';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import './index.css';

class ToggleSwitch extends Component {
	// initialize state of the toggleswitch component
	state = { enabled: this.enabledFromProps() }

	// define method to get state of toggleswitch
	isEnabled = () => this.state.enabled

	// This method returns a boolean indicating if the switch should be enabled when it is rendered
	// If enabled prop is a boolean, it returns a boolean value
	// If it is function, it first invoked the function
	// otherwise return false
	enabledFromProps() {

		// resolve `enabled` prop that was passed
		let { enabled } = this.props;

		// If enabled is a function, invoke the function
		enabled = isFunction(enabled) ? enabled() : enabled;

		// Return enabled if it is boolean, otherwise false
		return isBoolean(enabled) && enabled;
	}

	// This method will be triggered as a click event listener
	toggleSwitch = evt => {
		evt.persist();
		evt.preventDefault();

		const { onClick, onStateChanged } = this.props;

		// Toggles the current `enabled` state using the logical `NOT(!)` operator
		this.setState({ enabled : !this.state.enabled }, () => {
			const state = this.state;

			// Augment the event object with SWITCH_STATE
			const switchEvent = Object.assign(evt, {SWITCH_STATE: state });

			// Execute the callback functions
			isFunction(onClick) && onClick(switchEvent);
			isFunction(onStateChanged) && onStateChanged(state);
		});
	}

	render() {
		// destructure the `enabled` state from component
		const { enabled } = this.state;

		// Isolate special props and store remaining as `restProps` so that restProps can be passed down to the switch
		// This enable us to intercept and isolate the special props of component
		const { enabled: _enabled, theme, onClick, className, onStateChanged, ...restProps } = this.props;

		// Use default as a fallback theme if valid theme is not passed
		const switchTheme = (theme && isString(theme)) ? theme : 'default';

		// Use the classnames to construct the classes for the switch and inner toggler, based on the theme
		const switchClasses = classnames(
			`switch switch--${switchTheme}`,
			className
		)

		// Use the classnames to construct the classes for the switch and inner toggler, based on the enabled state of the component
		const togglerClasses = classnames(
			'switch-toggle',
			`switch-toggle--${enabled ? 'on' : 'off'}`
		)

		// Finally, render dom elements with appropriate props and classes
		// Notice that we passed the `this.toggleSwitch` as click event listener on the switch
		return (
			<div className={switchClasses} onClick={this.toggleSwitch} {...restProps}>
				<div className={togglerClasses}></div>
			</div>
		)
	}
}

// Add typechecks for ToggleSwitch component
ToggleSwitch.propTypes = {
	// This is a string and indicates style and color to be used for toggle switch
	theme: PropTypes.string,

	// This can be either boolean or function that returns a boolean 
	// Also this determines state of the toggle switch when it is rendered
	enabled: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.func
	]),

	// This is a callback function that will be called when state of the toggle switch changes
	// This is useful for triggering actions on the parent component when the switch is toggled
	onStateChanged: PropTypes.func
}

export default ToggleSwitch;