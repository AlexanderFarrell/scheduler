const {MarkdownToHTML} = require("../Server/Modules/ServerHelper")

function ToHTML(md) {
    return MarkdownToHTML(md)
}

console.log(ToHTML(`# Table of Contents

 - [Introduction](#introduction)
 - [Scope](#scope)
 - [Objectives](#objectives)
    - [Core](#core)
    - [Stretch](#stretch)
 - [SWOT](#swot)
    - [Strength](#strength)
    - [Weaknesses](#weaknesses)
    - [Opportunity](#opportunity)
    - [Threat](#threat)
 - [Budget](#budget)



## Introduction



# Scope



# Objectives



## Core



## Stretch



# SWOT



## Strength



## Weaknesses



## Opportunity



## Threat



# Budget



`))