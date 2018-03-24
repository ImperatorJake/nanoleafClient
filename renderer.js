const auroraDevice = require('nanoleaf-aurora-client');
const auth = require('./auroraAuth.js');
const device = new auroraDevice(auth);

document.addEventListener('DOMContentLoaded', () => {
  checkDevicePowerStatus();
  getEffects();
  addInputSubmitEventListeners();
});

function submitEffect() {
  var currentEffect = document.getElementById('currentEffect');
  var effectError = document.getElementById('effectError');
  var effect = document.getElementById('effectInput').value;
  if (effect !== '') {
    // Set the current effect
    device.setEffect(effect).then(() => {
        currentEffect.innerHTML = effect;
      }).catch((err) => {
        effectError.innerHTML = err+' Invalid Effect';
      });
  }
}

function checkDevicePowerStatus() {
  var checkbox = document.getElementById('checkbox1');
  var lightStatus = document.getElementById('lightStatus');
  //use JSON.stringify() and/or JSON.parse() to access JSON data
  device.getPowerStatus().then((info) => {
    info = JSON.parse(info);
    checkbox.checked = info.value;
    if (info.value) {
      lightStatus.innerHTML = 'Lights Are On';
    } else {
      lightStatus.innerHTML = 'Lights Are Off';
    }
    addPowerStatusEventListener(checkbox);
  }).catch((err) => {
      lightStatus.innerHTML = err;
  });
}

function getEffects() {
  var currentEffect = document.getElementById('currentEffect');
  var possibleEffects = document.getElementById('possibleEffects');
  device.getEffect().then((effect) => {
      currentEffect.innerHTML = JSON.parse(effect);
    }).catch((err) => {
      currentEffect.innerHTML = err;
  });
  device.listEffects().then((effects) => {
      possibleEffects.innerHTML = JSON.parse(effects);
    }).catch((err) => {
      possibleEffects.innerHTML = err;
  });
}

function addInputSubmitEventListeners() {
  document.getElementById('submitButton').addEventListener('click', () => {
    submitEffect();
  });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      submitEffect();
    }
  });
}

function addPowerStatusEventListener(checkbox) {
  var lightStatus = document.getElementById('lightStatus');
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      //Turn the device on
      device.turnOn().then(() => {
          lightStatus.innerHTML = 'Lights Are On';
        }).catch((err) => {
          lightStatus.innerHTML = err;
      });
    } else {
      //Turn the device off
      device.turnOff().then(() => {
          lightStatus.innerHTML = 'Lights Are Off';
        }).catch((err) => {
          lightStatus.innerHTML = err;
      });
    }
  });
}
