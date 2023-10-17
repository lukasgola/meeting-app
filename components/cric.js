<CircularProgress
            activeStrokeColor={colors.primary}
            //activeStrokeSecondaryColor={colors.secondary}
            activeStrokeWidth={props.size/25}
            inActiveStrokeColor={null}
            inActiveStrokeWidth={props.size/25}
            value={props.score}
            radius={props.size/2}
            duration={0}
            progressValueColor={colors.text}
            maxValue={5}
            showProgressValue={false}
            // progressFormatter={(value) => {
            //     'worklet';
                
            //     return value // 2 decimal places
            // }}
        />