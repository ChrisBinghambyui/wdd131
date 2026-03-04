from pytest import approx
import pytest

def water_column_height(tower_height, tank_height):
    h = tower_height + (3 * tank_height) / 4
    return h

def test_water_column_height():
    assert isinstance(water_column_height(5, 18), float), "extract_given_name must return a float"

    assert water_column_height(0, 0) == 0
    assert water_column_height(0, 10) == 7.5
    assert water_column_height(25, 0) == 25
    assert water_column_height(48.3, 12.8) == 57.9

def pressure_gain_from_water_height(height):
    p = (998.2 * 9.80665 * height)/1000
    return p

def test_pressure_gain_from_water_height():
    assert isinstance(water_column_height(5, 18), float), "extract_given_name must return a float"

    assert pressure_gain_from_water_height(0) == approx(0, abs=0.001)
    assert pressure_gain_from_water_height(30.2) == approx(295.628, abs=0.001)
    assert pressure_gain_from_water_height(50) == approx(489.450, abs=0.001)

def pressure_loss_from_pipe(pipe_diameter,
        pipe_length, friction_factor, fluid_velocity):
    p = (-friction_factor * pipe_length * 998.2 * fluid_velocity**2)/(2000*pipe_diameter)
    return p

def test_pressure_loss_from_pipe():
    assert isinstance(pressure_loss_from_pipe(0.048692, 0, 0.018, 1.75), float), "pressure_loss_from_pipe must return a float"

    # Table-driven checks (pipe_diameter, pipe_length, friction_factor, fluid_velocity, expected)
    assert pressure_loss_from_pipe(0.048692, 0, 0.018, 1.75) == approx(0, abs=0.001)
    assert pressure_loss_from_pipe(0.048692, 200, 0, 1.75) == approx(0, abs=0.001)
    assert pressure_loss_from_pipe(0.048692, 200, 0.018, 0) == approx(0, abs=0.001)
    assert pressure_loss_from_pipe(0.048692, 200, 0.018, 1.75) == approx(-113.008, abs=0.001)
    assert pressure_loss_from_pipe(0.048692, 200, 0.018, 1.65) == approx(-100.462, abs=0.001)
    assert pressure_loss_from_pipe(0.28687, 1000, 0.013, 1.65) == approx(-61.576, abs=0.001)
    assert pressure_loss_from_pipe(0.28687, 1800.75, 0.013, 1.65) == approx(-110.884, abs=0.001)


pytest.main(["-v", "--tb=line", "-rN", __file__])
