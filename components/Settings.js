import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, ScrollView } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native-appearance';

import { connect } from 'react-redux'

import { setTimeFormat } from '../actions/setTimeFormat'
import { setTheme } from '../actions/setTheme'
  
import SwitchComponent from './SwitchComponent'

const Settings = ({statePreferences, setTimeFormat, setTheme}) => {

    const [selectedTimeFormat, setSelectedTimeFormat] = useState(statePreferences.timeFormat == 24 ? true : false);
    const [selectedSystem, setSelectedSystem] = useState(true);
    const [selectedManual, setSelectedManual] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(statePreferences.theme)

    let colorScheme = useColorScheme();

    useEffect(() => {
        if (statePreferences.theme !== 'automatic') {
            setSelectedSystem(false);
            if (statePreferences) {
                setSelectedManual(true);
            } else {
                setSelectedManual(false);
            }
        }
    }, []);

    if (statePreferences.theme !== 'automatic') {
        colorScheme = statePreferences.theme;
    }

    let containerStyle = styles.lightContainer
    let textStyle = styles.lightText
    
    if (colorScheme === 'dark') {
        containerStyle = styles.darkContainer
        textStyle = styles.darkText
    }

    const toggleTheme = (item) => {
        setSelectedTheme(item)
        setTheme(item)
    }

    const toggleSystemDefault = (item) => {
        if (item) {
            toggleTheme('automatic')
            setSelectedSystem(true);
            setSelectedManual(null);
        } else if (item!= null && item == false) {
            setSelectedManual(false);
            toggleTheme('light')
            setSelectedSystem(false);
        }
    }

    const toggleManualTheme = (item) => {
        if (item) {
            setSelectedManual(true);
            toggleTheme('dark')
        } else if (item!= null && item == false) {
            setSelectedManual(false);
            toggleTheme('light')
        }
    }

    const toggleTimeFormat = (value) => { 
        setSelectedTimeFormat(value)
        setTimeFormat(value ? 24 : 12)
    }
    
    return (
        <SafeAreaView style={[styles.container, containerStyle]}>
            <ScrollView 
                style={[styles.container, containerStyle]} 
                contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'center'}}
            >
                <Text style={[styles.text, textStyle, {fontSize: 24, paddingVertical: 15}]}>Settings</Text>

                <SwitchComponent 
                    title="Use 24-hour format" 
                    value={selectedTimeFormat} 
                    onValueChange={toggleTimeFormat} 
                />
                <SwitchComponent 
                    title="Use System Default Theme" 
                    value={selectedSystem} 
                    onValueChange={toggleSystemDefault} 
                />
                {!selectedSystem &&
                    <SwitchComponent 
                        title="Use Dark Theme" 
                        value={selectedManual} 
                        onValueChange={toggleManualTheme} 
                    />
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    lightContainer: {

    },
    darkContainer: {
        backgroundColor: '#383838'
    },
    text: {
        fontFamily: 'Montserrat_400Regular'
    },
    lightText: {
        color: 'black'
    },
    darkText: {
        color: 'white'
    }
  });

const mapStateToProps = (state) => ({
    statePreferences: state.preference.preferences
})

const mapDispatchToProps = dispatch => {
    return {
        setTimeFormat: (value) => dispatch(setTimeFormat(value)),
        setTheme: (value) => dispatch(setTheme(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)