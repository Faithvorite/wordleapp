import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React, { useEffect,useState } from 'react'
import { colors, colorsToEmoji } from '../../constants'
import * as Clipboard from "expo-clipboard"

const Number = ({ number, label }) => (
    <View style={{alignItems: "center", margin: 10 }}>
        <Text style={{color: colors.lightgrey, fontSize: 25, fontWeight: "bold"}}>{number}</Text>
        <Text style={{color: colors.lightgrey, fontSize: 16}}>{label}</Text>
    </View>
)

const GuessDistributionLine = ({position, amount, percentage}) => {
    return (
        <View 
        style = {{
        flexDirection: 'row', 
        alignItems: "center",
        width: "100%",
       }}>
            <Text style={{color: colors.lightgrey}}>{position}</Text>
            <View 
            style={{
            alignSelf: "stretch",
            width: `${percentage}%`,
            backgroundColor: colors.grey,
             margin: 5, 
             padding: 5
             }}>
                
                <Text style={{color: colors.lightgrey}}>{amount}</Text>
            </View>
        </View>
    )
}

const GuessDistribution = () => {
    return (
        <>
        <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>
        <View style = {{width: "100%", padding: 20}}>
            <GuessDistributionLine position={0} amount={2} percentage={50} />
            <GuessDistributionLine position={0} amount={2} percentage={50} />
            <GuessDistributionLine position={0} amount={2} percentage={50} />
            <GuessDistributionLine position={0} amount={2} percentage={50} />
        </View>
        </>
    )
}
const EndScreen = ({ won = false, rows, getCellBGColor}) => {
   
    const [secondsTillTomorrow, setSecondsTillTomorrow] = useState(0);
    
    const share = () => {
        const textMap = rows
          .map((row, i) =>
            row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
          )
          .filter((row) => row)
          .join("\n");
        const textToShare = `Wordle \n${textMap}`;
        Clipboard.setStringAsync(textToShare);
        Alert.alert("Copied successfully", "Share your score on you social media");
      };
    useEffect(()=> {
        const updateTime= () => {
            const now = new Date();
            const tomorrow = new Date(
            now.getFullYear(), 
            now.getMonth(), 
            now.getDate() + 1
            );

            setSecondsTillTomorrow((tomorrow - now) /1000);
        };
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval)
    }, [])

    
    const formatSeconds = () => {
        const hours = Math.floor(secondsTillTomorrow / ( 60 *60));
        const minutes = Math.floor((secondsTillTomorrow % (60 * 60)) / 60);
        const seconds = Math.floor(secondsTillTomorrow % 60);

        return `${hours}: ${minutes} : ${seconds}`
    };

  return (
    <View style={{width: "100%", alignItems: "center"}}>
      <Text style ={styles.title}>
        {won ? 'Congrats!' : 'Meh, try again tomorrow'}
        </Text>
        <Text style ={styles.subTitle}> STATISTICS </Text>
            <View style={{flexDirection: "row", marginBottom: 20}}>
            <Number number={2} label={"Played"} />
            <Number number={2} label={"Win %"} />
            <Number number={2} label={"Cur Streak"} />
            <Number number={2} label={"Max Streak"} />
            </View>
            <GuessDistribution />
        
        <View style={{flexDirection: "row", width: "90%", justifyContent: "center"}}>
            <View style={{alignItems: "center", flex: 1}} >
                <Text style={{color: colors.lightgrey}}>Next Wordle</Text>
                <Text style={{color: colors.lightgrey, fontSize: 20}}>{formatSeconds()}</Text>
            </View>

        <Pressable onPress={share} 
        style={{
            flex:1, 
            backgroundColor: colors.primary, 
            borderRadius: 25, 
            alignItems: "center",
        justifyContent: "center"
    }}>
            <Text style={{color: colors.lightgrey, fontWeight: "bold"}}>
                SHARE
            </Text>
        </Pressable>
            </View>
    </View>
  )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        marginVertical: 20,

    },
    subTitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: "center",
        marginVertical: 15,
    }
})
export default EndScreen