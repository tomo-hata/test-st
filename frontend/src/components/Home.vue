<template>
    <div class="home">
        
        <center>
        <table>
            <tr>
                <td><router-link to='/createToken'>createToken</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/sendToken'>sendToken</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/tokenSwap'>tokenSwap</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/tsClaim'>tsClaim</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/getTxList'>getTxList</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/getTxList_parAcc'>getTxList_parAcc</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/getTS_TradeId'>getTS_TradeId</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/getTS_byEOA'>getTS_byEOA</router-link></td>
            </tr>
            <tr>
                <td><router-link to='/getTokenList'>getTokenList</router-link></td>
            </tr>
        </table>
        
        </center>
        
        <hr>
        <!--Button name='sample'/-->
        <hr>
    </div>
</template>

<script>
import Vue from 'vue'
import Button from '@/components/Button.vue'

export default {
    name: 'home',
    components: {
        Button
    },
    data () {
        return {
            msg: 'Home'
        }
    }
}
    
</script>